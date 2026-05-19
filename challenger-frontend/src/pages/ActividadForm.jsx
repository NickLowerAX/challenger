import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import styles from './ActividadForm.module.css';

const DEPORTES = ['Fútbol','Baloncesto','Tenis','Running','Ciclismo','Natación','Voleibol','Béisbol','Otro'];

export default function ActividadForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [form, setForm] = useState({
    titulo: '', descripcion: '', deporte: '',
    fecha: '', ubicacion: '', latitud: '',
    longitud: '', max_participantes: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Si es edición, carga los datos de la actividad
  useEffect(() => {
    if (esEdicion) {
      api.get(`/actividades/${id}`).then((res) => {
        const a = res.data;
        setForm({
          titulo: a.titulo,
          descripcion: a.descripcion,
          deporte: a.deporte,
          fecha: a.fecha?.slice(0, 16) ?? '',
          ubicacion: a.ubicacion,
          latitud: a.latitud ?? '',
          longitud: a.longitud ?? '',
          max_participantes: a.max_participantes,
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (esEdicion) {
        await api.put(`/actividades/${id}`, form);
      } else {
        await api.post('/actividades', form);
      }
      navigate('/');
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors
        ? Object.values(errors).flat().join(', ')
        : 'Error al guardar la actividad'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.card}>

          <div className={styles.cardHeader}>
            <button className={styles.backBtn} onClick={() => navigate('/')}>
              ← Volver
            </button>
            <h2>{esEdicion ? 'Editar actividad' : 'Nueva actividad'}</h2>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Título de la actividad</label>
                <input
                  name="titulo" value={form.titulo}
                  onChange={handleChange} required
                  placeholder="Ej: Fútbol dominical en el parque"
                />
              </div>
              <div className={styles.field}>
                <label>Deporte</label>
                <select name="deporte" value={form.deporte}
                  onChange={handleChange} required>
                  <option value="">Selecciona un deporte</option>
                  {DEPORTES.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label>Descripción</label>
              <textarea
                name="descripcion" value={form.descripcion}
                onChange={handleChange} required rows={3}
                placeholder="Describe la actividad, qué necesitan llevar, nivel requerido..."
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Fecha y hora</label>
                <input
                  type="datetime-local" name="fecha"
                  value={form.fecha} onChange={handleChange} required
                />
              </div>
              <div className={styles.field}>
                <label>Máximo de participantes</label>
                <input
                  type="number" name="max_participantes"
                  value={form.max_participantes}
                  onChange={handleChange} min={2} max={100} required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Ubicación</label>
              <input
                name="ubicacion" value={form.ubicacion}
                onChange={handleChange} required
                placeholder="Ej: Parque Central, San Salvador"
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Latitud (opcional)</label>
                <input
                  type="number" step="any" name="latitud"
                  value={form.latitud} onChange={handleChange}
                  placeholder="13.6929"
                />
              </div>
              <div className={styles.field}>
                <label>Longitud (opcional)</label>
                <input
                  type="number" step="any" name="longitud"
                  value={form.longitud} onChange={handleChange}
                  placeholder="-89.2182"
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancelar}
                onClick={() => navigate('/')}>
                Cancelar
              </button>
              <button type="submit" className={styles.btnGuardar} disabled={loading}>
                {loading ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear actividad'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}