<?php
    //EndPoint para inicio de sesion
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ActividadController;
use Illuminate\Support\Facades\Route;

// ─── Rutas públicas (no necesitan token) ───────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ─── Rutas protegidas (necesitan token de Sanctum) ─────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout',  [AuthController::class, 'logout']);
    Route::get('/me',       [AuthController::class, 'me']);
    Route::put('/perfil',   [AuthController::class, 'update']);

    // Actividades - CRUD completo
    Route::apiResource('actividades', ActividadController::class);

    // Unirse y salir de actividades
    Route::post('/actividades/{id}/unirse', [ActividadController::class, 'unirse']);
    Route::delete('/actividades/{id}/salir', [ActividadController::class, 'salir']);
});