import { CheckIcon, InstagramIcon } from '../../components/icons';
import Logo from '../../components/Logo';
import styles from './Cadastro.module.css';

function CadastroSucesso({ nome }) {
  return (
    <div className={`${styles.card} ${styles.successCard}`}>
      <div className={`${styles.logoFrame} ${styles.successLogoFrame}`}>
        <Logo size="hero" />
      </div>
      <div className={styles.successBadge}>
        <CheckIcon className={styles.successIcon} />
      </div>
      <h1 className={styles.successTitle}>Cadastro confirmado</h1>
      <p className={styles.successText}>
        {nome ? `Obrigado, ${nome.split(' ')[0]}. ` : 'Obrigado. '}
        Seus dados foram recebidos com sucesso. Em breve voce comeca a receber as novidades da casa.
      </p>
      <a
        className={styles.socialLink}
        href="https://www.instagram.com/divinno.cervejaria/"
        target="_blank"
        rel="noreferrer"
      >
        <InstagramIcon />
        @divinno.cervejaria
      </a>
    </div>
  );
}

export default CadastroSucesso;
