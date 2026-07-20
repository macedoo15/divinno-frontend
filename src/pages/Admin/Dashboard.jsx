import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { isAdminAuthenticated, listarClientes, logoutAdmin } from '../../services/adminService';
import styles from './Admin.module.css';

function Dashboard() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadClientes() {
      try {
        const data = await listarClientes();
        setClientes(data);
        setStatus('success');
      } catch (err) {
        const message = err?.response?.data?.message || err.message;
        setError(
          Array.isArray(message)
            ? message.join(' ')
            : message || 'Nao foi possivel carregar os clientes.'
        );
        setStatus('error');
      }
    }

    loadClientes();
  }, []);

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  function handleLogout() {
    logoutAdmin();
    navigate('/admin/login');
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <div className={styles.header}>
            <span className={styles.eyebrow}>Administrativo</span>
            <h1 className={styles.title}>Clientes cadastrados</h1>
            <p className={styles.subtitle}>{clientes.length} cadastro(s) encontrado(s).</p>
          </div>
          <button className={styles.textButton} type="button" onClick={handleLogout}>
            Sair
          </button>
        </div>

        {status === 'loading' && <p className={styles.empty}>Carregando clientes...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {status === 'success' && clientes.length === 0 && (
          <p className={styles.empty}>Nenhum cliente cadastrado ainda.</p>
        )}

        {status === 'success' && clientes.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>WhatsApp</th>
                  <th>Nascimento</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id || cliente.email}>
                    <td>{cliente.nome || '-'}</td>
                    <td>{cliente.email || '-'}</td>
                    <td>{cliente.whatsapp || '-'}</td>
                    <td>{cliente.dataNascimento || cliente.data_nascimento || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Button type="button" onClick={() => navigate('/')}>
          Novo cadastro
        </Button>
      </section>
    </main>
  );
}

export default Dashboard;
