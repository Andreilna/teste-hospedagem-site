import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import styles from "../styles/Home.module.css";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import VegetableSelector from "../components/VegetableSelector/VegetableSelector";
import GrowthChart from "../components/GrowthChart/GrowthChart";
import WaterLevelChart from "../components/WaterLevelChart/WaterLevelChart";
import Indicators from "../components/Indicators/Indicators";
import Alerts from "../components/Alerts/Alerts";
import CameraPreview from "../components/CameraPreview/CameraPreview";
import SensorDetails from "../components/SensorDetails/SensorDetails";
import RecentReports from "../components/RecentReports/RecentReports";

export default function Home() {
  const router = useRouter();
  const [selectedVegetable, setSelectedVegetable] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ✅ Proteção de rota (verifica token ao carregar a página)
  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token");

    if (!token) {
      router.replace("/"); // se não tiver token, volta pro login
    } else {
      setIsCheckingAuth(false); // autorizado a renderizar o conteúdo
    }
  }, [router]);

  const handleVegetableSelect = (vegetable) => setSelectedVegetable(vegetable);

  // Tela de carregamento enquanto verifica autenticação
  if (isCheckingAuth) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
        <p>Verificando acesso...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <main className={styles.mainContent}>
        <Header />
        <div className={styles.selectorContainer}>
          <VegetableSelector
            onVegetableSelect={handleVegetableSelect}
            selectedVegetable={selectedVegetable}
          />
        </div>

        <div className={styles.top}>
          <div className={styles.chartArea}>
            <GrowthChart selectedVegetable={selectedVegetable} />
            <WaterLevelChart selectedVegetable={selectedVegetable} />
          </div>

          <div className={styles.rightColumn}>
            <Indicators selectedVegetable={selectedVegetable} />
            <Alerts selectedVegetable={selectedVegetable} />
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.tile}>
            <CameraPreview selectedVegetable={selectedVegetable} />
          </div>

          <div className={styles.tile}>
            <SensorDetails selectedVegetable={selectedVegetable} />
          </div>

          <div className={styles.tile}>
            <RecentReports selectedVegetable={selectedVegetable} />
          </div>
        </div>
      </main>
    </div>
  );
}
