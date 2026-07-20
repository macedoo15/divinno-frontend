import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAdminAuthenticated, listarClientes, logoutAdmin } from '../../services/adminService';
import { maskPhone } from '../../utils/masks';
import styles from './Admin.module.css';

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Marco',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const PAGE_SIZE = 10;

function getValue(cliente, keys) {
  return keys.map((key) => cliente?.[key]).find((value) => value !== undefined && value !== null) || '';
}

function normalizeCliente(cliente) {
  return {
    id: getValue(cliente, ['id', 'uuid', 'clienteId']),
    nome: getValue(cliente, ['nome', 'name']),
    email: getValue(cliente, ['email']),
    whatsapp: getValue(cliente, ['whatsapp', 'telefone', 'phone']),
    dataNascimento: getValue(cliente, ['dataNascimento', 'data_nascimento', 'nascimento', 'birthDate']),
    criadoEm: getValue(cliente, ['criadoEm', 'createdAt', 'created_at', 'dataCadastro', 'data_cadastro']),
  };
}

function parseDate(value) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value, withTime = false) {
  const date = parseDate(value);
  if (!date) return '-';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date);
}

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function formatPhone(value) {
  const digits = onlyDigits(value);
  return digits ? maskPhone(digits) : '-';
}

function stripText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function isSameMonth(value, monthIndex) {
  const date = parseDate(value);
  return date ? date.getMonth() === monthIndex : false;
}

function compareBy(field, direction) {
  return (a, b) => {
    const dateFields = ['dataNascimento', 'criadoEm'];
    const aValue = dateFields.includes(field) ? parseDate(a[field])?.getTime() || 0 : stripText(a[field]);
    const bValue = dateFields.includes(field) ? parseDate(b[field])?.getTime() || 0 : stripText(b[field]);

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  };
}

function escapeCell(value) {
  return String(value || '-')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function exportExcel(rows, filename) {
  const htmlRows = rows
    .map(
      (cliente) => `
        <tr>
          <td>${escapeCell(cliente.nome)}</td>
          <td>${escapeCell(formatPhone(cliente.whatsapp))}</td>
          <td>${escapeCell(cliente.email)}</td>
          <td>${escapeCell(formatDate(cliente.dataNascimento))}</td>
          <td>${escapeCell(formatDate(cliente.criadoEm, true))}</td>
        </tr>`
    )
    .join('');

  const table = `
    <html>
      <head><meta charset="UTF-8" /></head>
      <body>
        <table border="1">
          <thead>
            <tr>
              <th>Nome</th>
              <th>WhatsApp</th>
              <th>Email</th>
              <th>Data de nascimento</th>
              <th>Data de cadastro</th>
            </tr>
          </thead>
          <tbody>${htmlRows}</tbody>
        </table>
      </body>
    </html>`;

  const blob = new Blob([table], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xls`;
  link.click();
  URL.revokeObjectURL(url);
}

function Dashboard() {
  const navigate = useNavigate();
  const authenticated = isAdminAuthenticated();
  const [clientes, setClientes] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [buscaNome, setBuscaNome] = useState('');
  const [buscaTelefone, setBuscaTelefone] = useState('');
  const [mesFiltro, setMesFiltro] = useState('');
  const [sort, setSort] = useState({ field: 'criadoEm', direction: 'desc' });
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authenticated) return;

    async function loadClientes() {
      try {
        const data = await listarClientes();
        setClientes(data.map(normalizeCliente));
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
  }, [authenticated]);

  useEffect(() => {
    setPage(1);
  }, [buscaNome, buscaTelefone, mesFiltro, sort]);

  const filteredClientes = useMemo(() => {
    const nome = stripText(buscaNome);
    const telefone = onlyDigits(buscaTelefone);
    const month = mesFiltro === '' ? null : Number(mesFiltro);

    return clientes
      .filter((cliente) => {
        const matchNome = !nome || stripText(`${cliente.nome} ${cliente.email}`).includes(nome);
        const matchTelefone = !telefone || onlyDigits(cliente.whatsapp).includes(telefone);
        const matchMes = month === null || isSameMonth(cliente.dataNascimento, month);
        return matchNome && matchTelefone && matchMes;
      })
      .sort(compareBy(sort.field, sort.direction));
  }, [buscaNome, buscaTelefone, clientes, mesFiltro, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredClientes.length / PAGE_SIZE));
  const pageClientes = filteredClientes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const now = new Date();
  const totalClientes = clientes.length;
  const aniversariantesMes = clientes.filter((cliente) =>
    isSameMonth(cliente.dataNascimento, now.getMonth())
  ).length;
  const novosCadastros = clientes.filter((cliente) => isSameMonth(cliente.criadoEm, now.getMonth())).length;
  const ultimosClientes = [...clientes].sort(compareBy('criadoEm', 'desc')).slice(0, 5);
  const hasFilters = Boolean(buscaNome || buscaTelefone || mesFiltro !== '');

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  function handleLogout() {
    logoutAdmin();
    navigate('/admin/login');
  }

  function clearFilters() {
    setBuscaNome('');
    setBuscaTelefone('');
    setMesFiltro('');
  }

  function toggleSort(field) {
    setSort((current) => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  }

  function sortLabel(field) {
    if (sort.field !== field) return '';
    return sort.direction === 'asc' ? ' ↑' : ' ↓';
  }

  return (
    <main className={styles.adminPage}>
      <section className={styles.dashboard}>
        <div className={styles.toolbar}>
          <div className={styles.header}>
            <span className={styles.eyebrow}>Administrativo</span>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>Acompanhe cadastros, aniversariantes e exportacoes.</p>
          </div>
          <button className={styles.textButton} type="button" onClick={handleLogout}>
            Sair
          </button>
        </div>

        {status === 'loading' && <p className={styles.empty}>Carregando clientes...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {status === 'success' && (
          <>
            <div className={styles.metricsGrid}>
              <article className={styles.metric}>
                <span>Total de clientes</span>
                <strong>{totalClientes}</strong>
              </article>
              <article className={styles.metric}>
                <span>Aniversariantes do mes</span>
                <strong>{aniversariantesMes}</strong>
              </article>
              <article className={styles.metric}>
                <span>Novos cadastros</span>
                <strong>{novosCadastros}</strong>
              </article>
            </div>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Ultimos clientes cadastrados</h2>
              </div>
              <div className={styles.recentGrid}>
                {ultimosClientes.map((cliente) => (
                  <article className={styles.recentItem} key={cliente.id || cliente.email}>
                    <strong>{cliente.nome || '-'}</strong>
                    <span>{formatPhone(cliente.whatsapp)}</span>
                    <small>{formatDate(cliente.criadoEm, true)}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Lista de clientes</h2>
                  <p>{filteredClientes.length} registro(s) encontrado(s).</p>
                </div>
                <div className={styles.exportActions}>
                  <button
                    className={styles.secondaryButton}
                    type="button"
                    onClick={() => exportExcel(filteredClientes, 'clientes-filtrados')}
                    disabled={!filteredClientes.length}
                  >
                    Exportar filtrados
                  </button>
                  <button
                    className={styles.primaryButton}
                    type="button"
                    onClick={() => exportExcel(clientes, 'clientes-todos')}
                    disabled={!clientes.length}
                  >
                    Exportar todos
                  </button>
                </div>
              </div>

              <div className={styles.filters}>
                <input
                  type="search"
                  placeholder="Buscar por nome ou e-mail"
                  value={buscaNome}
                  onChange={(event) => setBuscaNome(event.target.value)}
                />
                <input
                  type="search"
                  placeholder="Buscar por telefone"
                  value={buscaTelefone}
                  onChange={(event) => setBuscaTelefone(event.target.value)}
                />
                <select value={mesFiltro} onChange={(event) => setMesFiltro(event.target.value)}>
                  <option value="">Todos os meses</option>
                  {MESES.map((mes, index) => (
                    <option value={index} key={mes}>
                      {mes}
                    </option>
                  ))}
                </select>
                {hasFilters && (
                  <button className={styles.textButton} type="button" onClick={clearFilters}>
                    Limpar filtros
                  </button>
                )}
              </div>

              <div className={styles.monthGrid}>
                {MESES.map((mes, index) => (
                  <button
                    className={mesFiltro === String(index) ? styles.monthActive : styles.monthButton}
                    type="button"
                    onClick={() => setMesFiltro(mesFiltro === String(index) ? '' : String(index))}
                    key={mes}
                  >
                    {mes.slice(0, 3)}
                  </button>
                ))}
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>
                        <button type="button" onClick={() => toggleSort('nome')}>
                          Nome{sortLabel('nome')}
                        </button>
                      </th>
                      <th>
                        <button type="button" onClick={() => toggleSort('whatsapp')}>
                          WhatsApp{sortLabel('whatsapp')}
                        </button>
                      </th>
                      <th>E-mail</th>
                      <th>
                        <button type="button" onClick={() => toggleSort('dataNascimento')}>
                          Data de nascimento{sortLabel('dataNascimento')}
                        </button>
                      </th>
                      <th>
                        <button type="button" onClick={() => toggleSort('criadoEm')}>
                          Data do cadastro{sortLabel('criadoEm')}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageClientes.map((cliente, index) => (
                      <tr key={cliente.id || cliente.email || `${cliente.nome}-${index}`}>
                        <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
                        <td>{cliente.nome || '-'}</td>
                        <td>{formatPhone(cliente.whatsapp)}</td>
                        <td>{cliente.email || '-'}</td>
                        <td>{formatDate(cliente.dataNascimento)}</td>
                        <td>{formatDate(cliente.criadoEm, true)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!pageClientes.length && (
                  <p className={styles.empty}>Nenhum cliente encontrado para os filtros aplicados.</p>
                )}
              </div>

              <div className={styles.pagination}>
                <button type="button" onClick={() => setPage((value) => value - 1)} disabled={page === 1}>
                  Anterior
                </button>
                <span>
                  Pagina {page} de {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((value) => value + 1)}
                  disabled={page === totalPages}
                >
                  Proxima
                </button>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
