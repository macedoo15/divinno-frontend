import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import { LockIcon, MailIcon } from '../../components/icons';
import { loginAdmin } from '../../services/adminService';
import styles from './Admin.module.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      await loginAdmin({ email, senha, password: senha });
      navigate('/admin');
    } catch (err) {
      const message = err?.response?.data?.message || err.message;
      setError(Array.isArray(message) ? message.join(' ') : message || 'Nao foi possivel entrar.');
      setStatus('error');
    }
  }

  return (
    <main className={styles.page}>
      <section className={`${styles.panel} ${styles.narrow}`}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Divinno</span>
          <h1 className={styles.title}>Area administrativa</h1>
          <p className={styles.subtitle}>Entre para consultar os cadastros recebidos.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <FormField
            id="adminEmail"
            label="E-mail"
            icon={<MailIcon />}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <FormField
            id="adminSenha"
            label="Senha"
            icon={<LockIcon />}
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
          />

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" loading={status === 'submitting'}>
            Entrar
          </Button>
        </form>

        <Link className={styles.backLink} to="/">
          Voltar para o cadastro
        </Link>
      </section>
    </main>
  );
}

export default Login;
