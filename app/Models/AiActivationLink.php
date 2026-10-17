<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class AiActivationLink extends Model
{
    use HasFactory;

    protected $table = 'ai_activation_links';

    protected $fillable = [
        'token',
        'service_type',
        'service_name',
        'plan_id',
        'validity_days',
        'is_used',
        'used_by_email',
        'used_by_user_id',
        'used_at',
        'expires_at',
        'created_by_admin_id',
        'access_instructions',
        'secret_credentials',
    ];

    protected function casts(): array
    {
        return [
            'is_used' => 'boolean',
            'validity_days' => 'integer',
            'used_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'used_by_user_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_admin_id');
    }

    /**
     * Generate a unique secure activation token
     */
    public static function generateToken(string $serviceType = 'gemini'): string
    {
        $prefix = match($serviceType) {
            'gemini' => 'act_gemini_',
            'chatgpt' => 'act_chatgpt_',
            'claude' => 'act_claude_',
            'grok' => 'act_grok_',
            default => 'act_ai_',
        };

        return $prefix . Str::random(24);
    }
}
