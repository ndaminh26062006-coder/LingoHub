<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // POST /api/auth/register
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:7|confirmed',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'], // auto-hashed via cast
            'role'     => 'student',
            'status'   => 'active',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $this->formatUser($user),
            'token' => $token,
        ], 201);
    }

    // POST /api/auth/login
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email hoặc mật khẩu không đúng.'],
            ]);
        }

        if ($user->isBlocked()) {
            return response()->json([
                'message' => 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin.',
            ], 403);
        }

        // Revoke old tokens, keep session clean
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $this->formatUser($user),
            'token' => $token,
        ]);
    }

    // POST /api/auth/logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Đăng xuất thành công.']);
    }

    // GET /api/auth/me
    public function me(Request $request)
    {
        return response()->json($this->formatUser($request->user()));
    }

    // PUT /api/auth/profile
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'   => 'sometimes|string|max:255',
            'school' => 'sometimes|nullable|string|max:255',
            'major'  => 'sometimes|nullable|string|max:255',
            'year'   => 'sometimes|nullable|string|max:10',
            'phone'  => 'sometimes|nullable|string|max:20',
        ]);

        $user->update($data);

        return response()->json($this->formatUser($user->fresh()));
    }

    // PUT /api/auth/password
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:6|confirmed',
        ]);

        if (! Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Mật khẩu hiện tại không đúng.'],
            ]);
        }

        $user->update(['password' => $request->password]);

        return response()->json(['message' => 'Đổi mật khẩu thành công.']);
    }

    private function formatUser(User $user): array
    {
        return [
            'id'        => $user->id,
            'name'      => $user->name,
            'email'     => $user->email,
            'role'      => $user->role,
            'admin_role' => $user->admin_role,
            'status'    => $user->status,
            'school'    => $user->school,
            'major'     => $user->major,
            'year'      => $user->year,
            'phone'     => $user->phone,
            'free_uses' => $user->free_uses,
        ];
    }
}
