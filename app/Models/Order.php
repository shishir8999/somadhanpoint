<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = [];

    protected $casts = [
        'delivery_fee' => 'float',
        'subtotal' => 'float',
        'discount' => 'float',
        'total' => 'float',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function consignment()
    {
        return $this->hasOne(CourierConsignment::class, 'order_id');
    }
}
