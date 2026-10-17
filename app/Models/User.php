<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
        'avatar',
        'current_plan_id',
        'subscription_start_date',
        'subscription_expiry',
        'token_usage',
        'max_tokens',
        'daily_images_used',
        'daily_prompts_used',
        'daily_usage_date',
        'active_seat_key',
        'wallet_balance_bdt',
        'reseller_discount_percent',
        'joined_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'subscription_start_date' => 'datetime',
            'subscription_expiry' => 'datetime',
            'joined_at' => 'datetime',
            'wallet_balance_bdt' => 'decimal:2',
            'reseller_discount_percent' => 'decimal:2',
        ];
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isReseller(): bool
    {
        return $this->role === 'reseller';
    }

    public function currentPlan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'current_plan_id', 'id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(PaymentOrder::class, 'user_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(UserDocument::class, 'user_id');
    }

    public function chats(): HasMany
    {
        return $this->hasMany(ChatMessage::class, 'user_id');
    }

    public function resellerSales(): HasMany
    {
        return $this->hasMany(ResellerClientSale::class, 'reseller_id');
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class, 'user_id');
    }
}
