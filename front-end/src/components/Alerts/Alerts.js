import styles from './Alerts.module.css';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';
import { 
  FaExclamationTriangle, 
  FaThermometerHalf, 
  FaTint, 
  FaSun, 
  FaLeaf,
  FaClock,
  FaBell
} from 'react-icons/fa';

export default function Alerts({ selectedVegetable }) {

  // Função para gerar alertas baseados no nível da hortaliça selecionada
  const getWaterAlerts = () => {
    const alerts = [];

    if (selectedVegetable && selectedVegetable.nivel && selectedVegetable.nivel.nivel_agua !== null && selectedVegetable.nivel.nivel_agua !== undefined) {
      const waterLevel = selectedVegetable.nivel.nivel_agua;
      const vegetableName = selectedVegetable.nome_hortalica;
      
      if (waterLevel < 30) {
        alerts.push({
          type: 'danger',
          icon: FaTint,
          title: 'Nível de Água Crítico',
          description: `${vegetableName}: ${waterLevel}L - Precisa de água urgentemente`,
          time: 'Agora'
        });
      } else if (waterLevel < 50) {
        alerts.push({
          type: 'warning',
          icon: FaTint,
          title: 'Nível de Água Baixo',
          description: `${vegetableName}: ${waterLevel}L - Considere reabastecer`,
          time: 'Há 2 min'
        });
      } else if (waterLevel > 150) {
        alerts.push({
          type: 'warning',
          icon: FaTint,
          title: 'Nível de Água Alto',
          description: `${vegetableName}: ${waterLevel}L - Verifique drenagem`,
          time: 'Há 1 min'
        });
      } else {
        alerts.push({
          type: 'success',
          icon: FaTint,
          title: 'Nível de Água Ideal',
          description: `${vegetableName}: ${waterLevel}L - Funcionando perfeitamente`,
          time: 'Há 5 min'
        });
      }
    } else if (selectedVegetable) {
      // Se há hortaliça selecionada mas sem nível definido
      alerts.push({
        type: 'info',
        icon: FaTint,
        title: 'Nível de Água Não Definido',
        description: `${selectedVegetable.nome_hortalica}: Defina o nível de água para monitoramento`,
        time: 'Agora'
      });
    } else {
      // Se não há hortaliça selecionada, mostra alerta genérico
      alerts.push({
        type: 'info',
        icon: FaTint,
        title: 'Selecione uma Hortaliça',
        description: 'Escolha uma hortaliça para ver os níveis de água',
        time: 'Agora'
      });
    }

    // Alertas padrão do sistema
    alerts.push(
      {
        type: 'info',
        icon: FaThermometerHalf,
        title: 'Temperatura Estável',
        description: '24°C - Condições ideais',
        time: 'Há 10 min'
      },
      {
        type: 'info',
        icon: FaSun,
        title: 'Luminosidade Adequada',
        description: '800 lux - Luz suficiente',
        time: 'Há 15 min'
      }
    );

    return alerts;
  };

  const alerts = getWaterAlerts();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FaBell className={styles.headerIcon} />
        <h4 className={styles.title}>
          ALERTAS DO SISTEMA
        </h4>
      </div>
      
      <div className={styles.alertsList}>
        {alerts.map((alert, index) => {
          const IconComponent = alert.icon;
          return (
            <div key={index} className={`${styles.alertCard} ${styles[alert.type]}`}>
              <div className={styles.alertIcon}>
                <IconComponent className={styles.icon} />
              </div>
              <div className={styles.alertContent}>
                <div className={styles.alertTitle}>{alert.title}</div>
                <div className={styles.alertDescription}>{alert.description}</div>
                <div className={styles.alertTime}>
                  <FaClock className={styles.timeIcon} />
                  <span>{alert.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
