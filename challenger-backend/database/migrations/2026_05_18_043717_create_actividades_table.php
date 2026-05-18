<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('actividades', function (Blueprint $table) {
            $table->id('id_actividad');
            $table->string('titulo', 100);
            $table->text('descripcion');
            $table->string('deporte', 50);
            $table->dateTime('fecha');
            $table->string('ubicacion', 100);
            $table->decimal('latitud', 10, 8)->nullable();
            $table->decimal('longitud', 11, 8)->nullable();
            $table->unsignedBigInteger('creador_id');
            $table->integer('max_participantes')->default(10);
            $table->timestamps();

            $table->foreign('creador_id')
                  ->references('id_usuario')
                  ->on('usuarios')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('actividades');
    }
};
