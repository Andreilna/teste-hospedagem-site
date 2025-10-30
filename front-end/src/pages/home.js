import React, { useState } from "react";
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
import { parse } from "cookie";
import jwt from "jsonwebtoken";

export default function Home() {
  const [selectedVegetable, setSelectedVegetable] = useState(null);

  const handleVegetableSelect = (vegetable) => setSelectedVegetable(vegetable);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      document.cookie = "token=; max-age=0; path=/; HttpOnly";
      window.location.href = "/"; // volta para login
    }
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar onLogout={handleLogout} />
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

export async function getServerSideProps({ req, res }) {
  const cookiesHeader = req.headers.cookie || "";
  const cookies = parse(cookiesHeader);
  const token = cookies.token;

  if (!token) {
    return { redirect: { destination: "/", permanent: false } };
  }

  try {
    const SECRET = process.env.JWT_SECRET;
    if (!SECRET) throw new Error("JWT_SECRET não configurado");

    jwt.verify(token, SECRET);
    return { props: {} }; // Token válido
  } catch (err) {
    console.error("Erro de verificação JWT:", err.message);

    // Limpa o cookie inválido
    res.setHeader("Set-Cookie", "token=; Max-Age=0; Path=/; HttpOnly");

    return { redirect: { destination: "/", permanent: false } };
  }
}
