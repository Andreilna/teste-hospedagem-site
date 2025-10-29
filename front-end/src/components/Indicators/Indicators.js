import styles from './Indicators.module.css';
import { useState, useEffect } from 'react';
import { getVegetableSensorData, apiFetch } from '@/services/api';
import { 
  FaThermometerHalf, 
  FaTint, 
  FaSun, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaLeaf,
  FaSeedling,
  FaCloudRain,
  FaWind
} from 'react-icons/fa';

export default function Indicators({ selectedVegetable }) {
  // Função para obter o nível de água da hortaliça selecionada
  const getWaterLevel = () => {
    if (selectedVegetable && selectedVegetable.nivel && selectedVegetable.nivel.nivel_agua !== null && selectedVegetable.nivel.nivel_agua !== undefined) {
      return `${selectedVegetable.nivel.nivel_agua}L`;
    }
    return 'Não definido';
  };

  // Função para obter o status baseado no nível de água da hortaliça
  const getWaterStatus = () => {
    if (selectedVegetable && selectedVegetable.nivel && selectedVegetable.nivel.nivel_agua !== null && selectedVegetable.nivel.nivel_agua !== undefined) {
      const level = selectedVegetable.nivel.nivel_agua;
      if (level >= 50 && level <= 150) return 'Perfeita';
      if (level < 50) return 'Baixa';
      if (level > 150) return 'Alta';
    }
    return 'Não definido';
  };

  // Função para obter o nível de fertilizante da hortaliça selecionada
  const getFertilizerLevel = () => {
    if (selectedVegetable && selectedVegetable.nivel && selectedVegetable.nivel.nivel_fertilizante !== null && selectedVegetable.nivel.nivel_fertilizante !== undefined) {
      return `${selectedVegetable.nivel.nivel_fertilizante}%`;
    }
    return 'Não definido';
  };

  // Função para obter o status do fertilizante
  const getFertilizerStatus = () => {
    if (selectedVegetable && selectedVegetable.nivel && selectedVegetable.nivel.nivel_fertilizante !== null && selectedVegetable.nivel.nivel_fertilizante !== undefined) {
      const level = selectedVegetable.nivel.nivel_fertilizante;
      if (level >= 40 && level <= 80) return 'Adequado';
      if (level < 40) return 'Baixo';
      if (level > 80) return 'Alto';
    }
    return 'Não definido';
  };

  // Função para obter temperatura
  const getTemperature = () => {
    return '24°C';
  };

  // Função para obter luminosidade
  const getLuminosity = () => {
    return '800 lux';
  };

  // Função para obter pH do solo
  const getSoilPH = () => {
    return '6.5';
  };

  // Função para obter condutividade
  const getConductivity = () => {
    return '1.5 mS/cm';
  };

  return (
    <div className={styles.grid}>
      <div className={`${styles.card} ${styles.blue}`}>
        <div className={styles.iconContainer}>
          <FaThermometerHalf className={styles.icon} />
        </div>
        <div className={styles.content}>
          <div className={styles.label}>Temperatura</div>
          <div className={styles.value}>{getTemperature()}</div>
          <div className={styles.status}>
            <FaCheckCircle className={styles.statusIcon} />
            <span>Ideal</span>
          </div>
        </div>
      </div>
      
      <div className={`${styles.card} ${styles.green}`}>
        <div className={styles.iconContainer}>
          <FaTint className={styles.icon} />
        </div>
        <div className={styles.content}>
          <div className={styles.label}>Nível de Água</div>
          <div className={styles.value}>{getWaterLevel()}</div>
          <div className={styles.status}>
            <FaCheckCircle className={styles.statusIcon} />
            <span>{getWaterStatus()}</span>
          </div>
        </div>
      </div>
      
      <div className={`${styles.card} ${styles.yellow}`}>
        <div className={styles.iconContainer}>
          <FaSun className={styles.icon} />
        </div>
        <div className={styles.content}>
          <div className={styles.label}>Luminosidade</div>
          <div className={styles.value}>{getLuminosity()}</div>
          <div className={styles.status}>
            <FaCheckCircle className={styles.statusIcon} />
            <span>Ótima</span>
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.purple}`}>
        <div className={styles.iconContainer}>
          <FaLeaf className={styles.icon} />
        </div>
        <div className={styles.content}>
          <div className={styles.label}>Nível de Fertilizante</div>
          <div className={styles.value}>{getFertilizerLevel()}</div>
          <div className={styles.status}>
            <FaCheckCircle className={styles.statusIcon} />
            <span>{getFertilizerStatus()}</span>
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.orange}`}>
        <div className={styles.iconContainer}>
          <FaCloudRain className={styles.icon} />
        </div>
        <div className={styles.content}>
          <div className={styles.label}>pH do Solo</div>
          <div className={styles.value}>{getSoilPH()}</div>
          <div className={styles.status}>
            <FaCheckCircle className={styles.statusIcon} />
            <span>Normal</span>
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.teal}`}>
        <div className={styles.iconContainer}>
          <FaWind className={styles.icon} />
        </div>
        <div className={styles.content}>
          <div className={styles.label}>Condutividade</div>
          <div className={styles.value}>{getConductivity()}</div>
          <div className={styles.status}>
            <FaCheckCircle className={styles.statusIcon} />
            <span>Suave</span>
          </div>
        </div>
      </div>
    </div>
  );
}
