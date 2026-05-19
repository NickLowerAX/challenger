<?php
    //Todo lo que hay aquí es para el registro e inicio de sesion
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Registrar nuevo usuario
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nombre'           => 'required|string|max:100',
            'correo'           => 'required|email|unique:usuarios,correo',
            'contrasena'       => 'required|string|min:8|confirmed',
            'deporte_favorito' => 'required|string|max:50',
            'ubicacion'        => 'nullable|string|max:100',
        ]);

        $user = User::create([
            'nombre'           => $validated['nombre'],
            'correo'           => $validated['correo'],
            'contrasena'       => Hash::make($validated['contrasena']),
            'deporte_favorito' => $validated['deporte_favorito'],
            'ubicacion'        => $validated['ubicacion'] ?? null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    // Iniciar sesión
    public function login(Request $request)
    {
        $request->validate([
            'correo'     => 'required|email',
            'contrasena' => 'required|string',
        ]);

        $user = User::where('correo', $request->correo)->first();

        if (!$user || !Hash::check($request->contrasena, $user->contrasena)) {
            throw ValidationException::withMessages([
                'correo' => ['Las credenciales son incorrectas.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    // Cerrar sesión
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada exitosamente']);
    }

    // Ver usuario autenticado
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // Actualizar perfil
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nombre'           => 'sometimes|string|max:100',
            'deporte_favorito' => 'sometimes|string|max:50',
            'ubicacion'        => 'nullable|string|max:100',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Perfil actualizado',
            'user'    => $user,
        ]);
    }
}