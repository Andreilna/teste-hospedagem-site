import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <h2>GreenRise - Estufa Principal</h2>
      <div className={styles.right}>
        <span className={styles.status}>Status: <strong>OK</strong></span>
        <button className={styles.refreshButton}>Atualizar</button>
        <img src="https://i.pravatar.cc/32" alt="User" className={styles.userIcon} />
      </div>
    </header>
  );
}
