<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Actividad extends Model
{
    use HasFactory;

    protected $table = 'actividades';
    protected $primaryKey = 'id_actividad';

    protected $fillable = [
        'titulo',
        'descripcion',
        'deporte',
        'fecha',
        'ubicacion',
        'latitud',
        'longitud',
        'creador_id',
        'max_participantes',
    ];

    protected $casts = [
        'fecha' => 'datetime',
        'latitud' => 'float',
        'longitud' => 'float',
    ];

    // Una actividad pertenece a un usuario creador
    public function creador()
    {
        return $this->belongsTo(User::class, 'creador_id', 'id_usuario');
    }

    // Una actividad tiene muchos participantes
    public function participantes()
    {
        return $this->belongsToMany(
            User::class,
            'participantes',
            'actividad_id',
            'usuario_id'
        )->withTimestamps();
    }
}