<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class FreemiumUsage extends Model
{
    use HasFactory;

    protected $table = 'freemium_usages';

    protected $fillable = [
        'ip_address',
        'device_id',
        'feature',
        'used_count',
        'last_used_at',
    ];

    protected $casts = [
        'last_used_at' => 'datetime',
    ];

    /**
     * Get or create usage entry
     */
    public static function getOrCreate(string $ip, string $deviceId, string $feature): self
    {
        return self::firstOrCreate(
            [
                'ip_address' => $ip,
                'device_id' => $deviceId,
                'feature' => $feature,
            ],
            [
                'used_count' => 0,
                'last_used_at' => null,
            ]
        );
    }

    /**
     * Check if user has free uses remaining
     */
    public function hasRemainingUses(int $limit = 2): bool
    {
        return $this->used_count < $limit;
    }

    /**
     * Increment usage count
     */
    public function incrementUsage(): self
    {
        $this->increment('used_count');
        $this->update(['last_used_at' => now()]);
        return $this;
    }

    /**
     * Check if usage is exceeded
     */
    public function isExceeded(int $limit = 2): bool
    {
        return $this->used_count >= $limit;
    }

    /**
     * Reset usage (for admin)
     */
    public function reset(): self
    {
        return $this->update([
            'used_count' => 0,
            'last_used_at' => null,
        ]);
    }
}
