import styles from './Button.module.css';

function Button({ children, variant = 'primary', loading = false, ...rest }) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : children}
    </button>
  );
}

export default Button;
