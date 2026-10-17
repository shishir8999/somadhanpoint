<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class AdminStaff extends Authenticatable
{
    use HasFactory;

    protected $table = 'admin_staff';
    protected $guarded = [];

    protected $hidden = [
        'password',
    ];

    public function role()
    {
        return $this->belongsTo(AdminRole::class, 'role_id');
    }
}
