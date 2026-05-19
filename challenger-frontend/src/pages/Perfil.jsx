import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import styles from './Perfil.module.css';

const DEPORTES = ['Fútbol','Baloncesto','Tenis','Running','Ciclismo','Natación','Voleibol','Béisbol','Otro'];

export default function Perfil() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    nombre: user?.nombre ?? '',
    deporte_favorito: user?.deporte_favorito ?? '',
    ubicacion: user?.ubicacion ?? '',
  });
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje('');
    try {
      const res = await api.put('/perfil', form);
      updateUser(res.data.user);
      setMensaje('✓ Perfil actualizado correctamente');
    } catch {
      setMensaje('Error al guardar los cambios');
    } finally {
      setGuardando(false);
    }
  };

  const iniciales = user?.nombre
    ?.split(' ').slice(0, 2).map((n) => n[0]).join('') ?? '?';

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.card}>

          {/* Avatar */}
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>{iniciales}</div>
            <div>
              <h2>{user?.nombre}</h2>
              <p className={styles.correo}>{user?.correo}</p>
              <span className={styles.deporte}>⚽ {user?.deporte_favorito}</span>
            </div>
          </div>

          <hr className={styles.divider} />

          <h3 className={styles.sectionTitle}>Editar información</h3>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Nombre completo</label>
              <input
                name="nombre" value={form.nombre}
                onChange={handleChange} required
              />
            </div>

            <div className={styles.field}>
              <label>Deporte favorito</label>
              <select name="deporte_favorito" value={form.deporte_favorito}
                onChange={handleChange}>
                {DEPORTES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label>Ubicación</label>
              <input
                name="ubicacion" value={form.ubicacion}
                onChange={handleChange} placeholder="Tu zona o ciudad"
              />
            </div>

            {mensaje && (
              <p className={mensaje.includes('Error') ? styles.error : styles.success}>
                {mensaje}
              </p>
            )}

            <button type="submit" className={styles.btnGuardar} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}