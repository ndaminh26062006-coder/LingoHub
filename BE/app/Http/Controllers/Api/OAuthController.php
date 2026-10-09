<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class OAuthController extends Controller
{
    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            Log::info('=== Google Callback Started ===');

            $code = $request->query('code');
            
            if (!$code) {
                return $this->redirectToFrontend('error', 'No authorization code provided');
            }

            Log::info('Exchanging Google code for token...');
            
            $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'code' => $code,
                'client_id' => config('services.google.client_id'),
                'client_secret' => config('services.google.client_secret'),
                'redirect_uri' => config('services.google.redirect'),
                'grant_type' => 'authorization_code',
            ]);

            if (!$response->successful()) {
                Log::error('Google token exchange failed', ['response' => $response->body()]);
                return $this->redirectToFrontend('error', 'Failed to exchange code for token');
            }

            $tokenData = $response->json();
            $accessToken = $tokenData['access_token'];

            Log::info('Getting Google user info...');
            
            $userResponse = Http::withToken($accessToken)->get('https://www.googleapis.com/oauth2/v2/userinfo');

            if (!$userResponse->successful()) {
                Log::error('Google user info failed');
                return $this->redirectToFrontend('error', 'Failed to get user info');
            }

            $googleUser = $userResponse->json();

            Log::info('Google user retrieved', [
                'id' => $googleUser['id'],
                'email' => $googleUser['email'],
            ]);

            $user = $this->findOrCreateUser([
                'id' => $googleUser['id'],
                'email' => $googleUser['email'],
                'name' => $googleUser['name'] ?? 'Unknown',
                'avatar' => $googleUser['picture'] ?? null,
            ], 'google');

            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('Google OAuth success', ['user_id' => $user->id]);

            return $this->redirectToFrontend('success', null, $token, $user);
        } catch (\Throwable $e) {
            Log::error('Google OAuth failed', ['error' => $e->getMessage()]);
            return $this->redirectToFrontend('error', $e->getMessage());
        }
    }

    /**
     * Handle Facebook OAuth callback
     */
    public function handleFacebookCallback(Request $request)
    {
        try {
            Log::info('=== Facebook Callback Started ===');

            $code = $request->query('code');
            
            if (!$code) {
                return $this->redirectToFrontend('error', 'No authorization code provided');
            }

            Log::info('Exchanging Facebook code for token...');
            
            $response = Http::post('https://graph.facebook.com/v18.0/oauth/access_token', [
                'code' => $code,
                'client_id' => config('services.facebook.client_id'),
                'client_secret' => config('services.facebook.client_secret'),
                'redirect_uri' => config('services.facebook.redirect'),
            ]);

            if (!$response->successful()) {
                Log::error('Facebook token exchange failed');
                return $this->redirectToFrontend('error', 'Failed to exchange code for token');
            }

            $tokenData = $response->json();
            $accessToken = $tokenData['access_token'];

            Log::info('Getting Facebook user info...');
            
            $userResponse = Http::get('https://graph.facebook.com/me', [
                'fields' => 'id,name,email,picture',
                'access_token' => $accessToken,
            ]);

            if (!$userResponse->successful()) {
                Log::error('Facebook user info failed');
                return $this->redirectToFrontend('error', 'Failed to get user info');
            }

            $facebookUser = $userResponse->json();

            Log::info('Facebook user retrieved', [
                'id' => $facebookUser['id'],
                'email' => $facebookUser['email'] ?? 'unknown',
            ]);

            $user = $this->findOrCreateUser([
                'id' => $facebookUser['id'],
                'email' => $facebookUser['email'] ?? 'user_' . $facebookUser['id'] . '@facebook.local',
                'name' => $facebookUser['name'] ?? 'Unknown',
                'avatar' => $facebookUser['picture']['data']['url'] ?? null,
            ], 'facebook');

            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('Facebook OAuth success', ['user_id' => $user->id]);

            return $this->redirectToFrontend('success', null, $token, $user);
        } catch (\Throwable $e) {
            Log::error('Facebook OAuth failed', ['error' => $e->getMessage()]);
            return $this->redirectToFrontend('error', $e->getMessage());
        }
    }

    /**
     * Redirect to frontend with token + status
     */
    private function redirectToFrontend(string $status, ?string $error = null, ?string $token = null, ?User $user = null)
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');
        
        if ($status === 'success' && $token && $user) {
            $url = $frontendUrl . '/auth/callback?status=success&token=' . urlencode($token) . '&user=' . urlencode(json_encode([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]));
            return response()->redirectTo($url);
        } else {
            $url = $frontendUrl . '/login?oauth_error=' . urlencode($error ?? 'Unknown error');
            return response()->redirectTo($url);
        }
    }

    /**
     * Find or create user based on OAuth provider
     */
    private function findOrCreateUser(array $providerUser, string $provider): User
    {
        // Try to find by provider_id
        $user = User::where('provider', $provider)
            ->where('provider_id', $providerUser['id'])
            ->first();

        if ($user) {
            Log::info('Found existing user by provider');
            $user->update(['provider_avatar' => $providerUser['avatar'] ?? $user->provider_avatar]);
            return $user;
        }

        // Try to find by email
        if ($providerUser['email']) {
            $user = User::where('email', $providerUser['email'])->first();
            if ($user) {
                Log::info('Linking provider to existing user');
                $user->update([
                    'provider' => $provider,
                    'provider_id' => $providerUser['id'],
                    'provider_avatar' => $providerUser['avatar'],
                ]);
                return $user;
            }
        }

        // Create new user
        Log::info('Creating new user');
        
        $user = User::create([
            'name' => $providerUser['name'],
            'email' => $providerUser['email'],
            'provider' => $provider,
            'provider_id' => $providerUser['id'],
            'provider_avatar' => $providerUser['avatar'],
            'password' => null,
            'role' => 'student',
            'status' => 'active',
        ]);

        // OAuth users do NOT get free subscription - they must purchase
        // (Only regular registered users via register endpoint get free 1-subject)

        return $user;
    }
}
