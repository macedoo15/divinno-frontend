import logoSrc from '../../assets/images/logo-divinno.png';
import styles from './Logo.module.css';

function Logo({ size = 'md' }) {
  return (
    <img
      src={logoSrc}
      alt="Divinno Cervejaria e Restaurante"
      className={`${styles.logo} ${styles[size]}`}
    />
  );
}

export default Logo;
