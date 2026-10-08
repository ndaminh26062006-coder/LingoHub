<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password',
        'role', 'admin_role', 'school', 'major', 'year', 'phone', 'status', 'free_uses',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
    ];

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'admin' && $this->admin_role === 'super';
    }

    public function isContentAdmin(): bool
    {
        return $this->role === 'admin' && $this->admin_role === 'content';
    }

    public function isBlocked(): bool
    {
        return $this->status === 'blocked';
    }

    // Relationships
    public function subscription()
    {
        return $this->hasOne(Subscription::class);
    }

    public function paymentTransactions()
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    public function flashcardDecks()
    {
        return $this->hasMany(FlashcardDeck::class, 'created_by');
    }

    public function userExamSubmissions()
    {
        return $this->hasMany(UserExamSubmission::class);
    }

    public function userDocumentSubmissions()
    {
        return $this->hasMany(UserDocumentSubmission::class);
    }

    public function learningStreak()
    {
        return $this->hasOne(UserLearningStreak::class);
    }

    public function achievements()
    {
        return $this->hasMany(UserAchievement::class);
    }
}
