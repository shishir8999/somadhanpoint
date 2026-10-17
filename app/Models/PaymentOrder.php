<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_code',
        'user_id',
        'user_name',
        'user_email',
        'plan_id',
        'plan_name',
        'amount_bdt',
        'amount_usd',
        'method',
        'sender_number',
        'trx_id',
        'status',
        'approved_at',
        'seat_key',
        'activation_link_url',
        'email_sent',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'amount_bdt' => 'decimal:2',
            'amount_usd' => 'decimal:2',
            'approved_at' => 'datetime',
            'email_sent' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id', 'id');
    }
}
