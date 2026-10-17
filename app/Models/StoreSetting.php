<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreSetting extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'show_logo_text' => 'boolean',
        'banners' => 'array',
    ];

    public static function current()
    {
        return static::first() ?? new static([
            'site_name' => 'Somadhan Point',
            'phone1' => '01982708789',
            'email' => 'shishirbarai01982708789@gmail.com',
            'address' => 'সৌরভ কুঞ্জ, বেনারসি কমিউনিটি সেন্টার রোড, কদমতলী, ঢাকা ১২৩৬',
            'developer_name' => 'SHISHIR',
            'developer_url' => 'https://www.facebook.com/shishir9barai',
        ]);
    }
}
