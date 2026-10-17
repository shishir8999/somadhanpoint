<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminRole extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'permissions' => 'array',
        'is_system' => 'boolean',
    ];

    public function staff()
    {
        return $this->hasMany(AdminStaff::class, 'role_id');
    }
}
