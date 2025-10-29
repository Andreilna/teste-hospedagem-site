// pages/vegetableList.jsx
import styles from '@/styles/Home.module.css';

import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import VegetableList from '@/components/VegetableList/VegetableList';

export default function VegetableListPage() {
  return (
    <>
      <div className={styles.dashboard}>
        <Sidebar />
        <main className={styles.mainContent}>
          <Header />

          {/* Conteúdo da página */}
          <div className={styles.pageBody}>
            <VegetableList />
          </div>
        </main>
      </div>
    </>
  );
}
