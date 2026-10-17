<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PixelEvent extends Model
{
    use HasFactory;

    protected $table = 'pixel_events';

    protected $fillable = [
        'event_name',
        'event_data',
        'pixel_id',
        'user_id',
        'user_email',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'event_data' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
