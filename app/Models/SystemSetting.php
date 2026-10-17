<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'app_name',
        'brand_prefix',
        'brand_suffix',
        'logo_url',
        'brand_tagline',
        'brand_tagline_bn',
        'announcement_text',
        'usa_showcase_title',
        'showcase_youtube_url',
        'badge_text',
        'primary_color',
        'logo_icon',
        'custom_domain',
        'default_credit_percentage',
        'bkash_merchant',
        'nagad_merchant',
        'rocket_merchant',
        'upay_merchant',
        'auto_approve_payments',
        'currency',
        'bdt_to_usd_rate',
        'chatgpt_proxy_url',
        'gemini_api_key',
        'gemini_account_email',
        'gemini_family_invite_url',
        'openai_api_key',
        'claude_api_key',
        'grok_api_key',
        'support_phone',
        'support_email',
        'enable_usa_feature_page',
        'enable_in_app_chat',
        'enable_domain_proxy',
        'enable_reseller_network',
        'enable_floating_chat',
        'enable_header_marquee',
        'facebook_pixel_id',
        'enable_facebook_pixel',
    ];

    protected function casts(): array
    {
        return [
            'auto_approve_payments' => 'boolean',
            'enable_usa_feature_page' => 'boolean',
            'enable_in_app_chat' => 'boolean',
            'enable_domain_proxy' => 'boolean',
            'enable_reseller_network' => 'boolean',
            'enable_floating_chat' => 'boolean',
            'enable_header_marquee' => 'boolean',
            'enable_facebook_pixel' => 'boolean',
            'default_credit_percentage' => 'decimal:2',
            'bdt_to_usd_rate' => 'decimal:2',
        ];
    }
}
