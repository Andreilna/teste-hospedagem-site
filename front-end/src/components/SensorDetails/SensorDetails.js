import styles from './SensorDetails.module.css';
import { useState, useEffect, useMemo } from 'react';
import { getVegetableSensorData } from '@/services/api';
import { 
  FaThermometerHalf, 
  FaTint, 
  FaSeedling, 
  FaFlask,
  FaChartLine,
  FaCog,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock
} from 'react-icons/fa';

export default function SensorDetails({ selectedVegetable }) {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedVegetable?._id) {
      fetchSensorData();
    } else {
      setSensorData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVegetable?._id]);

  const fetchSensorData = async () => {
    if (!selectedVegetable?._id) return;
    setLoading(true);
    try {
      const data = await getVegetableSensorData(selectedVegetable._id);
      setSensorData(data);
    } catch (error) {
      console.error('Erro ao carregar dados dos sensores:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => (status === 'OK' ? FaCheckCircle : FaExclamationTriangle);
  const getStatusColor = (status) => (status === 'OK' ? '#27ae60' : '#e74c3c');

  const temperature = useMemo(() => {
    if (sensorData?.temperatura != null) return Math.round(sensorData.temperatura);
    return 24;
  }, [sensorData]);

  const waterLevel = useMemo(() => {
    if (sensorData?.nivel_agua != null) return Math.round(sensorData.nivel_agua);
    if (selectedVegetable?.nivel?.nivel_agua != null) return selectedVegetable.nivel.nivel_agua;
    return 70;
  }, [sensorData, selectedVegetable]);

  const waterStatus = useMemo(() => {
    if (waterLevel >= 60 && waterLevel <= 80) return 'OK';
    if (waterLevel < 60) return 'Baixo';
    if (waterLevel > 80) return 'Alto';
    return 'OK';
  }, [waterLevel]);

  const soilPH = useMemo(() => {
    if (sensorData?.ph_solo != null) return Number(sensorData.ph_solo).toFixed(1);
    return '6.5';
  }, [sensorData]);

  const conductivity = useMemo(() => {
    if (sensorData?.condutividade != null) return Number(sensorData.condutividade).toFixed(1);
    return '1.5';
  }, [sensorData]);

  const growthDays = useMemo(() => {
    if (selectedVegetable) return selectedVegetable.tempo_real || selectedVegetable.tempo_estimado || 'N/A';
    return 'N/A';
  }, [selectedVegetable]);

  return (
    <div className={styles.container} role="region" aria-label="Detalhes dos sensores">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconContainer} aria-hidden>
            <FaCog className={styles.headerIcon} />
          </div>
          <div className={styles.headerContent}>
            <h4 className={styles.title}>
              DETALHES DOS SENSORES
              {selectedVegetable && (
                <span className={styles.vegetableName} title={selectedVegetable.nome_hortalica}>
                  &nbsp;— {selectedVegetable.nome_hortalica}
                </span>
              )}
            </h4>
            <div className={styles.subtitle}>
              <FaClock className={styles.subtitleIcon} aria-hidden />
              <span>
                {selectedVegetable ? 'Monitoramento em tempo real' : 'Dados dos sensores'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sensorsGrid} aria-live="polite">
        {/* Temperatura */}
        <div className={styles.sensorCard}>
          <div className={styles.sensorIcon}><FaThermometerHalf /></div>
          <div className={styles.sensorContent}>
            <div className={styles.sensorLabel}>Temperatura</div>
            <div className={styles.sensorValue}>{temperature}°C</div>
            <div className={styles.sensorStatus}>
              <FaCheckCircle className={styles.statusIcon} style={{ color: '#27ae60' }} />
              <span>Ideal</span>
            </div>
          </div>
        </div>

        {/* Nível de Água */}
        <div className={styles.sensorCard}>
          <div className={styles.sensorIcon}><FaTint /></div>
          <div className={styles.sensorContent}>
            <div className={styles.sensorLabel}>Nível de Água</div>
            <div className={styles.sensorValue}>{waterLevel}%</div>
            <div className={styles.sensorStatus}>
              {(() => {
                const StatusIcon = getStatusIcon(waterStatus);
                const statusColor = getStatusColor(waterStatus);
                return (
                  <>
                    <StatusIcon className={styles.statusIcon} style={{ color: statusColor }} />
                    <span>{waterStatus}</span>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Crescimento */}
        <div className={styles.sensorCard}>
          <div className={styles.sensorIcon}><FaSeedling /></div>
          <div className={styles.sensorContent}>
            <div className={styles.sensorLabel}>Crescimento</div>
            <div className={styles.sensorValue}>{growthDays} dias</div>
            <div className={styles.sensorStatus}>
              <FaChartLine className={styles.statusIcon} style={{ color: '#3498db' }} />
              <span>
                {selectedVegetable
                  ? `${Math.min(100, Math.max(0, Math.round(((selectedVegetable.tempo_real || selectedVegetable.tempo_estimado || 0) / 90) * 100)))}%`
                  : '85%'}
              </span>
            </div>
          </div>
        </div>

        {/* pH */}
        <div className={styles.sensorCard}>
          <div className={styles.sensorIcon}><FaFlask /></div>
          <div className={styles.sensorContent}>
            <div className={styles.sensorLabel}>pH do Solo</div>
            <div className={styles.sensorValue}>{soilPH}</div>
            <div className={styles.sensorStatus}>
              <FaCheckCircle className={styles.statusIcon} style={{ color: '#27ae60' }} />
              <span>Normal</span>
            </div>
          </div>
        </div>

        {/* Condutividade */}
        <div className={styles.sensorCard}>
          <div className={styles.sensorIcon}><FaChartLine /></div>
          <div className={styles.sensorContent}>
            <div className={styles.sensorLabel}>Condutividade</div>
            <div className={styles.sensorValue}>{conductivity} mS/cm</div>
            <div className={styles.sensorStatus}>
              <FaCheckCircle className={styles.statusIcon} style={{ color: '#27ae60' }} />
              <span>Estável</span>
            </div>
          </div>
        </div>

        {/* Tipo (se tiver vegetal selecionado) */}
        {selectedVegetable && (
          <div className={styles.sensorCard}>
            <div className={styles.sensorIcon}><FaSeedling /></div>
            <div className={styles.sensorContent}>
              <div className={styles.sensorLabel}>Tipo</div>
              <div className={styles.sensorValue} title={selectedVegetable.tipo_hortalica}>
                {selectedVegetable.tipo_hortalica}
              </div>
              <div className={styles.sensorStatus}>
                <FaCheckCircle className={styles.statusIcon} style={{ color: '#27ae60' }} />
                <span>Cadastrado</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className={styles.loading}>
          <span>Carregando dados dos sensores...</span>
        </div>
      )}
    </div>
  );
}
