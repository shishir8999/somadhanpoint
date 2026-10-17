<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $guarded = [];

    protected $casts = [
        'gallery_images' => 'array',
        'sizes' => 'array',
        'colors' => 'array',
        'in_stock' => 'boolean',
        'current_price' => 'float',
        'original_price' => 'float',
        'rating' => 'float',
        'stock_quantity' => 'integer',
    ];

    public function colorVariants()
    {
        return $this->hasMany(ProductColorVariant::class);
    }

    public function categoryItem()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function brandItem()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }
}
