<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;

    protected $table = 'vouchers';

    protected $fillable = [
        'code',
        'discount_percent',
        'discount_bdt',
        'min_order_bdt',
        'max_uses',
        'used_count',
        'expiry_date',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'discount_percent' => 'decimal:2',
            'discount_bdt' => 'decimal:2',
            'min_order_bdt' => 'decimal:2',
            'max_uses' => 'integer',
            'used_count' => 'integer',
            'expiry_date' => 'date',
            'is_active' => 'boolean',
        ];
    }
}
