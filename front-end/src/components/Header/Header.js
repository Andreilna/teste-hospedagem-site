import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from './Header.module.css';

export default function Header({ onMenuClick, isSidebarOpen, isSidebarCollapsed }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determina qual ícone mostrar
  const showCloseIcon = isMobile && isSidebarOpen;
  
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button 
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="Toggle menu"
          data-menu-button
          aria-expanded={isSidebarOpen}
          title={isMobile ? (isSidebarOpen ? "Fechar menu" : "Abrir menu") : (isSidebarCollapsed ? "Expandir menu" : "Recolher menu")}
        >
          {showCloseIcon ? <FaTimes /> : <FaBars />}
        </button>
        <h2>Estufa Principal</h2>
      </div>
      <div className={styles.right}>
        <span className={styles.status}>Status: <strong>OK</strong></span>
        <button className={styles.refreshButton}>Atualizar</button>
        <img src="https://i.pravatar.cc/32" alt="User" className={styles.userIcon} />
      </div>
    </header>
  );
}
