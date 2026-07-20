import styles from './Panel.module.css';

function Panel({ icon, title, children }) {
  return (
    <section className={styles.panel}>
      {title && (
        <header className={styles.header}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <h2 className={styles.title}>{title}</h2>
        </header>
      )}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default Panel;
