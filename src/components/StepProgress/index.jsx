import styles from './StepProgress.module.css';

/**
 * Barra de progresso segmentada.
 * `current` é o índice (0-based) do segmento ativo.
 */
function StepProgress({ steps, current }) {
  return (
    <div className={styles.track} role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={steps}>
      {Array.from({ length: steps }).map((_, index) => (
        <span
          key={index}
          className={`${styles.segment} ${index <= current ? styles.active : ''}`}
        />
      ))}
    </div>
  );
}

export default StepProgress;
