import styles from './ArchDivider.module.css';

/**
 * Motivo de arcos concêntricos duplos, extraído da logo Divinno.
 * Usado como selo decorativo recorrente (divisor de seção).
 */
function ArchDivider({ flip = false }) {
  return (
    <div className={`${styles.wrapper} ${flip ? styles.flip : ''}`} aria-hidden="true">
      <svg viewBox="0 0 200 46" className={styles.svg}>
        <path
          d="M4 44 C 4 20, 30 4, 100 4 C 170 4, 196 20, 196 44"
          className={styles.archOuter}
        />
        <path
          d="M16 44 C 16 26, 38 12, 100 12 C 162 12, 184 26, 184 44"
          className={styles.archInner}
        />
      </svg>
    </div>
  );
}

export default ArchDivider;
