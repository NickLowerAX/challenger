<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';

    protected $fillable = [
        'nombre',
        'correo',
        'contrasena',
        'deporte_favorito',
        'ubicacion',
    ];

    protected $hidden = [
        'contrasena',
    ];

    public function getAuthPassword()
    {
        return $this->contrasena;
    }

    // Un usuario puede crear muchas actividades
    public function actividadesCreadas()
    {
        return $this->hasMany(Actividad::class, 'creador_id', 'id_usuario');
    }

    // Un usuario puede participar en muchas actividades
    public function actividadesParticipando()
    {
        return $this->belongsToMany(
            Actividad::class,
            'participantes',
            'usuario_id',
            'actividad_id'
        )->withTimestamps();
    }
}