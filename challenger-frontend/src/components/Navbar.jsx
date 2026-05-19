import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.nav}>
      {/* Logo */}
      <div className={styles.brand} onClick={() => navigate('/')}>
        <div className={styles.logoIcon}>C</div>
      </div>

      {/* Links laterales */}
      <div className={styles.links}>
        <button
          className={isActive('/') ? styles.linkActive : styles.link}
          onClick={() => navigate('/')}>
          🔍 Buscar
        </button>
        <button className={styles.link}>
          📍 Lugares
        </button>
        <button
          className={isActive('/actividades/nueva') ? styles.linkActive : styles.link}
          onClick={() => navigate('/actividades/nueva')}>
          🌐 Actividades
        </button>
        <button className={styles.link}>
          🔖 Favoritos
        </button>
        <button
          className={isActive('/perfil') ? styles.linkActive : styles.link}
          onClick={() => navigate('/perfil')}>
          👤 Perfil
        </button>
      </div>

      {/* Usuario y logout abajo */}
      <div className={styles.bottom}>
        {user && (
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
}