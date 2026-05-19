import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ActividadCard from '../components/ActividadCard';
import styles from './Home.module.css';

const DEPORTES = ['Todos','Fútbol','Baloncesto','Tenis','Running','Ciclismo','Natación','Voleibol','Otro'];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroDeporte, setFiltroDeporte] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');

  const cargarActividades = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtroDeporte !== 'Todos') params.deporte = filtroDeporte;
      if (busqueda) params.search = busqueda;
      const res = await api.get('/actividades', { params });
      setActividades(res.data);
    } catch {
      setError('No se pudieron cargar las actividades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarActividades(); }, [filtroDeporte]);

  const handleSearch = (e) => {
    e.preventDefault();
    cargarActividades();
  };

  const handleUnirse = async (id) => {
    try {
      await api.post(`/actividades/${id}/unirse`);
      cargarActividades();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al unirse');
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta actividad?')) return;
    try {
      await api.delete(`/actividades/${id}`);
      cargarActividades();
    } catch {
      alert('No se pudo eliminar');
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.content}>
        {/* Barra superior */}
        <div className={styles.topBar}>
          <form onSubmit={handleSearch} className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Buscar actividades..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </form>
          <div className={styles.userAvatar}>
            {user?.nombre?.[0]?.toUpperCase() ?? '?'}
          </div>
        </div>

        {/* Mapa placeholder */}
        <div className={styles.mapBox}>
          <div className={styles.mapPin}>📍</div>
          <p>Mapa interactivo — próximamente con Google Maps</p>
        </div>

        {/* Filtros de deporte */}
        <div className={styles.filtros}>
          {DEPORTES.map((d) => (
            <button
              key={d}
              className={filtroDeporte === d ? styles.filtroActive : styles.filtro}
              onClick={() => setFiltroDeporte(d)}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Lista de actividades */}
        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <p className={styles.loading}>Cargando actividades...</p>
        ) : actividades.length === 0 ? (
          <div className={styles.empty}>
            <p>No hay actividades disponibles.</p>
            <button onClick={() => navigate('/actividades/nueva')}>
              + Crear la primera
            </button>
          </div>
        ) : (
          <div className={styles.lista}>
            {actividades.map((a) => (
              <ActividadCard
                key={a.id_actividad}
                actividad={a}
                currentUserId={user?.id_usuario}
                onUnirse={() => handleUnirse(a.id_actividad)}
                onEditar={() => navigate(`/actividades/${a.id_actividad}/editar`)}
                onEliminar={() => handleEliminar(a.id_actividad)}
                onClick={() => navigate(`/actividades/${a.id_actividad}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}