<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'avatar',
        'rating',
        'verified',
        'review_date',
        'comment_bn',
        'product_name',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'verified' => 'boolean',
        ];
    }
}
