import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const DEPORTES = ['Fútbol','Baloncesto','Tenis','Running','Ciclismo','Natación','Voleibol','Béisbol','Otro'];

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '', correo: '', contrasena: '',
    contrasena_confirmation: '', deporte_favorito: '', ubicacion: '',
  });
  const [error, setError] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!aceptaTerminos) { setError('Debes aceptar los términos y condiciones'); return; }
    if (form.contrasena !== form.contrasena_confirmation) { setError('Las contraseñas no coinciden'); return; }
    const result = await register(form);
    if (result.success) { navigate('/'); } else { setError(result.message); }
  };

  const fortaleza = form.contrasena.length === 0 ? 0
    : form.contrasena.length < 6 ? 1
    : form.contrasena.length < 10 ? 2 : 3;

  return (
    <div className={styles.authPage}>
      <div className={styles.card}>

        <div className={styles.logo}>
          <div className={styles.logoIcon}>C</div>
          <span>Challenger</span>
        </div>

        <h2>Crea tu cuenta</h2>
        <p className={styles.subtitle}>Únete a la comunidad y empieza a desafiarte.</p>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.field}>
            <span className={styles.fieldIcon}>👤</span>
            <input type="text" name="nombre" value={form.nombre}
              onChange={handleChange} placeholder="Nombre completo" required />
          </div>

          <div className={styles.field}>
            <span className={styles.fieldIcon}>✉</span>
            <input type="email" name="correo" value={form.correo}
              onChange={handleChange} placeholder="Correo electrónico" required />
          </div>

          <div className={styles.field}>
            <span className={styles.fieldIcon}>🔒</span>
            <input type={mostrarPass ? 'text' : 'password'}
              name="contrasena" value={form.contrasena}
              onChange={handleChange} placeholder="Contraseña" required minLength={8} />
            <button type="button" className={styles.eyeBtn}
              onClick={() => setMostrarPass(!mostrarPass)}>
              {mostrarPass ? '🙈' : '👁'}
            </button>
          </div>

          {/* Barra de fortaleza de contraseña */}
          {form.contrasena.length > 0 && (
            <div className={styles.strengthBar}>
              <div className={`${styles.strengthFill} ${styles[['','weak','medium','strong'][fortaleza]]}`} />
              <div className={styles.strengthFill} style={{opacity: fortaleza >= 2 ? 1 : 0.2}} />
              <div className={styles.strengthFill} style={{opacity: fortaleza >= 3 ? 1 : 0.2}} />
            </div>
          )}
          <small className={styles.passHint}>Usa al menos 8 caracteres con letras y números.</small>

          <div className={styles.field}>
            <span className={styles.fieldIcon}>🔒</span>
            <input type="password" name="contrasena_confirmation"
              value={form.contrasena_confirmation}
              onChange={handleChange} placeholder="Confirmar contraseña" required />
          </div>

          <div className={styles.field}>
            <span className={styles.fieldIcon}>⚽</span>
            <select name="deporte_favorito" value={form.deporte_favorito}
              onChange={handleChange} required>
              <option value="">Deporte favorito</option>
              {DEPORTES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          <label className={styles.checkLabel}>
            <input type="checkbox" checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)} />
            Acepto los <a href="#">Términos y Condiciones</a> y la <a href="#">Política de Privacidad</a>
          </label>

          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className={styles.switchLink}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}