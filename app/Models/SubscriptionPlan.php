<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'provider',
        'category',
        'description',
        'icon_name',
        'image_url',
        'badge',
        'is_out_of_stock',
        'price_bdt',
        'price_usd',
        'original_price_bdt',
        'billing_cycle',
        'features',
        'access_type',
        'direct_domain_url',
        'default_model_id',
        'available_seats',
        'daily_image_limit',
        'daily_prompt_limit',
        'total_sold',
        'is_active',
        'brand_color',
        'credentials_guide',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'is_out_of_stock' => 'boolean',
            'is_active' => 'boolean',
            'price_bdt' => 'decimal:2',
            'price_usd' => 'decimal:2',
            'original_price_bdt' => 'decimal:2',
            'available_seats' => 'integer',
            'daily_image_limit' => 'integer',
            'daily_prompt_limit' => 'integer',
            'total_sold' => 'integer',
        ];
    }

    public function orders(): HasMany
    {
        return $this->hasMany(PaymentOrder::class, 'plan_id', 'id');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'current_plan_id', 'id');
    }
}
