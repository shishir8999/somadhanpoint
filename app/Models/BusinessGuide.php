<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessGuide extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title_bn',
        'title_en',
        'tag',
        'read_time',
        'description_bn',
        'description_en',
        'key_points_bn',
        'key_points_en',
        'full_guide_markdown_bn',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'key_points_bn' => 'array',
            'key_points_en' => 'array',
            'is_published' => 'boolean',
        ];
    }
}
