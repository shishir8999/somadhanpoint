<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiServiceAsset extends Model
{
    use HasFactory;

    protected $table = 'ai_service_assets';

    protected $fillable = [
        'service_key',
        'name',
        'provider',
        'category',
        'logo_url',
        'custom_upload_path',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
