import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: '', contrasena: '' });
  const [error, setError] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.correo, form.contrasena);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.card}>

        <div className={styles.logo}>
          <div className={styles.logoIcon}>C</div>
          <span>Challenger</span>
        </div>

        <h2>Bienvenido de nuevo</h2>
        <p className={styles.subtitle}>Inicia sesión para continuar superando tus retos.</p>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <span className={styles.fieldIcon}>✉</span>
            <input
              type="email" name="correo"
              value={form.correo} onChange={handleChange}
              placeholder="Correo electrónico" required
            />
          </div>

          <div className={styles.field}>
            <span className={styles.fieldIcon}>🔒</span>
            <input
              type={mostrarPass ? 'text' : 'password'}
              name="contrasena"
              value={form.contrasena} onChange={handleChange}
              placeholder="Contraseña" required
            />
            <button type="button" className={styles.eyeBtn}
              onClick={() => setMostrarPass(!mostrarPass)}>
              {mostrarPass ? '🙈' : '👁'}
            </button>
          </div>

          <div className={styles.rowCheck}>
            <label className={styles.checkLabel}>
              <input type="checkbox" /> Recordarme
            </label>
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className={styles.divider}><span>o continúa con</span></div>

        <button className={styles.btnGoogle}>
          <img src="https://www.google.com/favicon.ico" alt="Google" width={18} />
          Continuar con Google
        </button>

        <p className={styles.switchLink}>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}