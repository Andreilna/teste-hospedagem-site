// pages/editVegetable.jsx
import styles from '@/styles/Home.module.css';

import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import VegetableEdit from '@/components/VegetableEdit/VegetableEdit';

export default function EditVegetablePage() {
  return (
    <>
      <div className={styles.dashboard}>
        <Sidebar />
        <main className={styles.mainContent}>
          <Header />

          {/* Conteúdo da página */}
          <div className={styles.pageBody}>
            <VegetableEdit />
          </div>
        </main>
      </div>
    </>
  );
}
