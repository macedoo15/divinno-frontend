import { forwardRef } from 'react';
import styles from './FormField.module.css';

const FormField = forwardRef(function FormField(
  { label, icon, error, id, ...inputProps },
  ref
) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...inputProps}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
});

export default FormField;
