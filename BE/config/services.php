<?php

return [
    'postmark' => [
        'secret' => env('POSTMARK_SECRET'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        // 'redirect' => env('GOOGLE_REDIRECT_URI', 'http://localhost:8000/api/auth/google/callback'),
        'redirect' => env('GOOGLE_REDIRECT_URI', 'https://api.lingohub.io.vn/api/auth/google/callback'),
    ],

    'facebook' => [
        'client_id' => env('FACEBOOK_CLIENT_ID'),
        'client_secret' => env('FACEBOOK_CLIENT_SECRET'),
        // 'redirect' => env('FACEBOOK_REDIRECT_URI', 'http://localhost:8000/api/auth/facebook/callback'),
        'redirect' => env('FACEBOOK_REDIRECT_URI', 'https://api.lingohub.io.vn/api/auth/facebook/callback'),    
        ],
];
