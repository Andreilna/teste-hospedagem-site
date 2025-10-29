import React from "react";
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
import jwt from "jsonwebtoken";

export default function Home() {
  const [selectedVegetable, setSelectedVegetable] = React.useState(null);

  const handleVegetableSelect = (vegetable) => setSelectedVegetable(vegetable);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      document.cookie = "token=; max-age=0"; // remove cookie
      window.location.href = "/"; // volta para login
    }
  };

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

export async function getServerSideProps({ req, res }) {
  const jwt = require('jsonwebtoken');

  // 1. Loga todos os cookies recebidos
  const cookiesHeader = req.headers.cookie || 'Nenhum cookie encontrado';
  console.log('--- SSR COOKIE DEBUG ---');
  console.log('Raw Cookie Header:', cookiesHeader); 
  
  // Obter o token do cookie (mantendo o import 'parse' do arquivo anterior)
  const { parse } = require('cookie');
  const cookies = parse(cookiesHeader);
  const token = cookies.token;
  
  console.log('Parsed Token:', token ? 'Token presente' : 'Token AUSENTE');
  console.log('------------------------');


  if (!token) {
    // Redireciona para o login se o cookie estiver faltando
    return { redirect: { destination: "/", permanent: false } };
  }

  // Tentar verificar o token
  try {
    const SECRET = process.env.JWT_SECRET;
    
    if (!SECRET) {
        console.error("ERRO: JWT_SECRET não configurado!");
        return { redirect: { destination: "/", permanent: false } };
    }
    
    jwt.verify(token, SECRET);
    
    // Sucesso: Token válido
    return { props: {} };

  } catch (e) {
    // Falha na verificação: Token inválido (expirado, modificado, ou SECRET errado)
    console.error("ERRO de Verificação JWT:", e.message);
    
    // Limpa o cookie inválido
    res.setHeader('Set-Cookie', 'token=; Max-Age=0; Path=/; HttpOnly');
    
    // Redireciona para o login
    return { redirect: { destination: "/", permanent: false } };
  }
}

