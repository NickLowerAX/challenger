<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('participantes', function (Blueprint $table) {
            $table->id('id_participante');
            $table->unsignedBigInteger('usuario_id');
            $table->unsignedBigInteger('actividad_id');
            $table->timestamps();

            $table->foreign('usuario_id')
                  ->references('id_usuario')
                  ->on('usuarios')
                  ->onDelete('cascade');

            $table->foreign('actividad_id')
                  ->references('id_actividad')
                  ->on('actividades')
                  ->onDelete('cascade');

            $table->unique(['usuario_id', 'actividad_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('participantes');
    }
};