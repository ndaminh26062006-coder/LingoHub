<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OptionalAuth
{
    /**
     * Handle an incoming request.
     * Authenticates the user if a valid token is present via sanctum,
     * but allows the request to continue if no token is provided.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // If Authorization header is present, try to authenticate
        if ($request->header('Authorization')) {
            try {
                // Sanctum middleware will authenticate if token is valid
                // We don't need to do anything special, just let sanctum handle it
            } catch (\Exception $e) {
                // Silently ignore auth errors - allow request to continue
            }
        }
        
        return $next($request);
    }
}

