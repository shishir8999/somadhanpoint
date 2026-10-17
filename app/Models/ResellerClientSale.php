<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResellerClientSale extends Model
{
    use HasFactory;

    protected $fillable = [
        'reseller_id',
        'client_name',
        'client_phone',
        'client_email',
        'plan_id',
        'plan_name',
        'duration_days',
        'duration_label',
        'start_date',
        'expiry_date',
        'seat_key',
        'wholesale_cost_bdt',
        'selling_price_bdt',
        'profit_bdt',
        'status',
        'credentials_or_url',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'expiry_date' => 'date',
            'wholesale_cost_bdt' => 'decimal:2',
            'selling_price_bdt' => 'decimal:2',
            'profit_bdt' => 'decimal:2',
            'duration_days' => 'integer',
        ];
    }

    public function reseller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reseller_id');
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id', 'id');
    }
}
