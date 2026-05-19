<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Actividad;
use Illuminate\Http\Request;

class ActividadController extends Controller
{
    // Listar todas las actividades
    public function index(Request $request)
    {
        $query = Actividad::with(['creador:id_usuario,nombre'])
            ->withCount('participantes');

        if ($request->has('deporte')) {
            $query->where('deporte', $request->deporte);
        }

        if ($request->has('search')) {
            $query->where('titulo', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->orderBy('fecha', 'asc')->get());
    }

    // Crear actividad
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo'            => 'required|string|max:100',
            'descripcion'       => 'required|string',
            'deporte'           => 'required|string|max:50',
            'fecha'             => 'required|date|after:now',
            'ubicacion'         => 'required|string|max:100',
            'latitud'           => 'nullable|numeric',
            'longitud'          => 'nullable|numeric',
            'max_participantes' => 'nullable|integer|min:2|max:100',
        ]);

        $actividad = Actividad::create([
            ...$validated,
            'creador_id' => $request->user()->id_usuario,
        ]);

        return response()->json([
            'message'   => 'Actividad creada exitosamente',
            'actividad' => $actividad->load('creador:id_usuario,nombre'),
        ], 201);
    }

    // Ver una actividad
    public function show($id)
    {
        $actividad = Actividad::with([
            'creador:id_usuario,nombre',
            'participantes:id_usuario,nombre',
        ])->withCount('participantes')->findOrFail($id);

        return response()->json($actividad);
    }

    // Editar actividad
    public function update(Request $request, $id)
    {
        $actividad = Actividad::findOrFail($id);

        if ($actividad->creador_id !== $request->user()->id_usuario) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'titulo'            => 'sometimes|string|max:100',
            'descripcion'       => 'sometimes|string',
            'deporte'           => 'sometimes|string|max:50',
            'fecha'             => 'sometimes|date',
            'ubicacion'         => 'sometimes|string|max:100',
            'latitud'           => 'nullable|numeric',
            'longitud'          => 'nullable|numeric',
            'max_participantes' => 'nullable|integer|min:2|max:100',
        ]);

        $actividad->update($validated);

        return response()->json([
            'message'   => 'Actividad actualizada',
            'actividad' => $actividad,
        ]);
    }

    // Eliminar actividad
    public function destroy(Request $request, $id)
    {
        $actividad = Actividad::findOrFail($id);

        if ($actividad->creador_id !== $request->user()->id_usuario) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $actividad->delete();
        return response()->json(['message' => 'Actividad eliminada']);
    }

    // Unirse a una actividad
    public function unirse(Request $request, $id)
    {
        $actividad = Actividad::withCount('participantes')->findOrFail($id);
        $userId = $request->user()->id_usuario;

        if ($actividad->participantes_count >= $actividad->max_participantes) {
            return response()->json(['message' => 'La actividad está llena'], 422);
        }

        if ($actividad->creador_id === $userId) {
            return response()->json(['message' => 'Eres el creador de esta actividad'], 422);
        }

        $actividad->participantes()->syncWithoutDetaching([$userId]);
        return response()->json(['message' => 'Te has unido a la actividad']);
    }

    // Salir de una actividad
    public function salir(Request $request, $id)
    {
        $actividad = Actividad::findOrFail($id);
        $actividad->participantes()->detach($request->user()->id_usuario);
        return response()->json(['message' => 'Has salido de la actividad']);
    }
}