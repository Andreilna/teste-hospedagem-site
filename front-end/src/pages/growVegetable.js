// pages/grow-vegetable.jsx (ou app/grow-vegetable/page.jsx em App Router)
import { useState } from 'react';
import styles from '@/styles/Home.module.css';

import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';


// IMPORTA o formulário (ajuste o caminho conforme onde você salvou o arquivo)
import VegetableForm from '@/components/VegetableForm/VegetableForm';

export default function GrowVegetable() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    const isMobileView = typeof window !== 'undefined' && window.innerWidth <= 1024;
    
    if (isMobileView) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div className={styles.dashboard}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar}
          isCollapsed={isSidebarCollapsed}
        />
        <main className={styles.mainContent} data-sidebar-collapsed={isSidebarCollapsed}>
          <Header 
            onMenuClick={toggleSidebar} 
            isSidebarOpen={isSidebarOpen}
            isSidebarCollapsed={isSidebarCollapsed}
          />

          {/* Conteúdo da página */}
          <div className={styles.pageBody}>
            <VegetableForm />
          </div>
        </main>
      </div>
    </>
  );
}