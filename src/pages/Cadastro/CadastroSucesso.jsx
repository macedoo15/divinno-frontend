import { CheckIcon } from '../../components/icons';
import ArchDivider from '../../components/ArchDivider';
import Logo from '../../components/Logo';
import styles from './Cadastro.module.css';

function CadastroSucesso({ nome }) {
  return (
    <div className={styles.card}>
      <Logo size="sm" />
      <div className={styles.successBadge}>
        <CheckIcon className={styles.successIcon} />
      </div>
      <h1 className={styles.successTitle}>Cadastro confirmado</h1>
      <p className={styles.successText}>
        {nome ? `Obrigado, ${nome.split(' ')[0]}. ` : 'Obrigado. '}
        Seus dados foram recebidos com sucesso. Em breve você começa a receber as novidades da casa.
      </p>
      <ArchDivider />
      <a className={styles.socialLink} href="https://instagram.com" target="_blank" rel="noreferrer">
        @divinnocervejaria
      </a>
    </div>
  );
}

export default CadastroSucesso;
