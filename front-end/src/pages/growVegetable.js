// pages/grow-vegetable.jsx (ou app/grow-vegetable/page.jsx em App Router)
import styles from '@/styles/Home.module.css';

import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';


// IMPORTA o formulário (ajuste o caminho conforme onde você salvou o arquivo)
import VegetableForm from '@/components/VegetableForm/VegetableForm';

export default function GrowVegetable() {
  return (
    <>
      <div className={styles.dashboard}>
        <Sidebar />
        <main className={styles.mainContent}>
          <Header />

          {/* Conteúdo da página */}
          <div className={styles.pageBody}>
            <VegetableForm />
          </div>
        </main>
      </div>
    </>
  );
}