import styles from './ActividadCard.module.css';

const ICONOS = {
  Fútbol: '⚽', Baloncesto: '🏀', Tenis: '🎾', Running: '🏃',
  Ciclismo: '🚴', Natación: '🏊', Voleibol: '🏐', Béisbol: '⚾', Otro: '🏅',
};

export default function ActividadCard({
  actividad, currentUserId, onUnirse, onEditar, onEliminar, onClick,
}) {
  const esMio = actividad.creador_id === currentUserId;
  const participantes = actividad.participantes_count ?? 0;
  const lleno = participantes >= actividad.max_participantes;

  const fecha = new Date(actividad.fecha);
  const horaStr = fecha.toLocaleTimeString('es-SV', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.left}>
        <div className={styles.iconCircle}>
          {ICONOS[actividad.deporte] ?? '🏅'}
        </div>
      </div>

      <div className={styles.info}>
        <h3 className={styles.titulo}>{actividad.titulo}</h3>
        <div className={styles.meta}>
          <span>🕐 {horaStr}</span>
          <span>·</span>
          <span>🏃 {actividad.deporte}</span>
          <span>·</span>
          <span>📍 {actividad.ubicacion}</span>
        </div>
        <span className={lleno ? styles.lleno : styles.libre}>
          👥 {participantes} / {actividad.max_participantes} participantes
        </span>
      </div>

      <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
        {esMio ? (
          <>
            <button className={styles.btnEditar} onClick={onEditar}>Editar</button>
            <button className={styles.btnEliminar} onClick={onEliminar}>Eliminar</button>
          </>
        ) : (
          <button
            className={styles.btnUnirse}
            onClick={onUnirse}
            disabled={lleno}
          >
            {lleno ? 'Lleno' : 'Unirme'}
          </button>
        )}
      </div>
    </div>
  );
}