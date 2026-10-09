<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan',
        'subjects',
        'price',
        'valid_from',
        'valid_until',
        'is_active',
        'payment_reference',
    ];

    protected $casts = [
        'subjects' => 'array',
        'valid_from' => 'date',
        'valid_until' => 'date',
    ];

    protected $appends = ['plan_name', 'plan_label'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accessors
    public function getPlanNameAttribute()
    {
        return $this->getPlanDisplay();
    }

    public function getPlanLabelAttribute()
    {
        return $this->getPlanLabel();
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->where('valid_until', '>=', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('valid_until', '<', now());
    }

    // Helpers
    public function isValid()
    {
        return $this->is_active && $this->valid_until >= now();
    }

    public function isActive()
    {
        return $this->is_active && $this->valid_until >= now();
    }

    public function getDaysRemaining()
    {
        return now()->diffInDays($this->valid_until);
    }

    public function daysRemaining()
    {
        return now()->diffInDays($this->valid_until);
    }

    public function getPlanDisplay()
    {
        return match($this->plan) {
            '1subject' => 'Gói 1 Môn',
            '3subject' => 'Gói 3 Môn',
            '5subject' => 'Gói 5 Môn',
            'full' => 'Gói Full Access',
            default => 'Gói ' . $this->plan,
        };
    }

    public function getPlanLabel()
    {
        return match($this->plan) {
            '1subject' => '1 Môn',
            '3subject' => '3 Môn',
            '5subject' => '5 Môn',
            'full' => 'Full Access',
            default => $this->plan,
        };
    }

    public function getPlanPrice()
    {
        return match($this->plan) {
            '1subject' => 19000,
            '3subject' => 39000,
            '5subject' => 49000,
            'full' => 69000,
            default => 0,
        };
    }

    /**
     * Check if user has access to a specific subject
     * Returns true if:
     * - Plan is 'full' (full access to all subjects)
     * - Subject ID is in the subjects array
     */
    public function hasSubject($subjectId)
    {
        // Full access plan can access all subjects
        if ($this->plan === 'full') {
            return true;
        }

        // Check if subject is in the subjects array
        if (!is_array($this->subjects)) {
            return false;
        }

        return in_array($subjectId, $this->subjects, true);
    }

    /**
     * Get the number of subjects user can access
     */
    public function getAccessibleSubjectCount()
    {
        if ($this->plan === 'full') {
            return 999; // Unlimited
        }

        return is_array($this->subjects) ? count($this->subjects) : 0;
    }

    /**
     * Check if this is a full access subscription
     */
    public function isFullAccess()
    {
        return $this->plan === 'full';
    }
}
