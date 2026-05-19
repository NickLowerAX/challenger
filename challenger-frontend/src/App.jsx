import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ActividadForm from './pages/ActividadForm';
import Perfil from './pages/Perfil';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route path="/" element={
            <ProtectedRoute><Home /></ProtectedRoute>
          } />
          <Route path="/actividades/nueva" element={
            <ProtectedRoute><ActividadForm /></ProtectedRoute>
          } />
          <Route path="/actividades/:id/editar" element={
            <ProtectedRoute><ActividadForm /></ProtectedRoute>
          } />
          <Route path="/perfil" element={
            <ProtectedRoute><Perfil /></ProtectedRoute>
          } />

          {/* Cualquier otra ruta manda al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}