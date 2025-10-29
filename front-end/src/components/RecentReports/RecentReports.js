import styles from './RecentReports.module.css';
import { useState, useEffect } from 'react';
import { getVegetableSensorData } from '@/services/api';
import { 
  FaFileAlt, 
  FaChartLine, 
  FaTint, 
  FaSeedling,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaDownload,
  FaEye
} from 'react-icons/fa';

export default function RecentReports({ selectedVegetable }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedVegetable) {
      generateReports();
    } else {
      setReports(getDefaultReports());
    }
  }, [selectedVegetable]);

  const getDefaultReports = () => [
    {
      id: 1,
      date: '2024/01/15',
      type: 'Relatório Geral',
      status: 'OK',
      icon: FaFileAlt,
      color: '#27ae60'
    },
    {
      id: 2,
      date: '2024/01/14',
      type: 'Análise de Solo',
      status: 'OK',
      icon: FaChartLine,
      color: '#3498db'
    },
    {
      id: 3,
      date: '2024/01/13',
      type: 'Monitoramento',
      status: 'Pendente',
      icon: FaSpinner,
      color: '#f39c12'
    }
  ];

  const generateReports = async () => {
    if (!selectedVegetable?._id) return;
    
    setLoading(true);
    try {
      const sensorData = await getVegetableSensorData(selectedVegetable._id);
      
      const today = new Date();
      const reports = [
        {
          id: 1,
          date: today.toISOString().split('T')[0],
          type: `${selectedVegetable.nome_hortalica} - Crescimento`,
          status: 'OK',
          icon: FaSeedling,
          color: '#27ae60',
          value: `${Math.round((selectedVegetable.tempo_real || selectedVegetable.tempo_estimado || 0) / 7 * 100)}%`
        },
        {
          id: 2,
          date: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: `${selectedVegetable.nome_hortalica} - Água`,
          status: sensorData?.nivel_agua >= 60 && sensorData?.nivel_agua <= 80 ? 'OK' : 'Atenção',
          icon: FaTint,
          color: sensorData?.nivel_agua >= 60 && sensorData?.nivel_agua <= 80 ? '#27ae60' : '#e74c3c',
          value: `${Math.round(sensorData?.nivel_agua || selectedVegetable?.nivel?.nivel_agua || 70)}%`
        },
        {
          id: 3,
          date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: `${selectedVegetable.nome_hortalica} - Sensores`,
          status: 'OK',
          icon: FaChartLine,
          color: '#3498db',
          value: `${Math.round(sensorData?.temperatura || 24)}°C`
        },
        {
          id: 4,
          date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: `${selectedVegetable.nome_hortalica} - Solo`,
          status: 'OK',
          icon: FaFileAlt,
          color: '#8e44ad',
          value: `${sensorData?.ph_solo?.toFixed(1) || '6.5'} pH`
        }
      ];
      
      setReports(reports);
    } catch (error) {
      console.error('Erro ao gerar relatórios:', error);
      setReports(getDefaultReports());
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OK':
        return FaCheckCircle;
      case 'Atenção':
        return FaExclamationTriangle;
      case 'Pendente':
        return FaSpinner;
      default:
        return FaCheckCircle;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OK':
        return '#27ae60';
      case 'Atenção':
        return '#e74c3c';
      case 'Pendente':
        return '#f39c12';
      default:
        return '#27ae60';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconContainer}>
            <FaFileAlt className={styles.headerIcon} />
          </div>
          <div className={styles.headerContent}>
            <h4 className={styles.title}>
              RELATÓRIOS RECENTES
              {selectedVegetable && (
                <span className={styles.vegetableName}> - {selectedVegetable.nome_hortalica}</span>
              )}
            </h4>
            <div className={styles.subtitle}>
              <FaClock className={styles.subtitleIcon} />
              <span>
                {selectedVegetable ? 
                  `Relatórios específicos da hortaliça` : 
                  'Últimos relatórios gerados'
                }
              </span>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.downloadBtn}>
            <FaDownload className={styles.downloadIcon} />
          </button>
        </div>
      </div>

      <div className={styles.reportsList}>
        {loading ? (
          <div className={styles.loading}>
            <FaSpinner className={styles.spinner} />
            <span>Gerando relatórios...</span>
          </div>
        ) : (
          reports.map((report) => {
            const IconComponent = report.icon;
            const StatusIcon = getStatusIcon(report.status);
            const statusColor = getStatusColor(report.status);
            
            return (
              <div key={report.id} className={styles.reportCard}>
                <div className={styles.reportIcon}>
                  <IconComponent style={{ color: report.color }} />
                </div>
                <div className={styles.reportContent}>
                  <div className={styles.reportHeader}>
                    <div className={styles.reportType}>{report.type}</div>
                    <div className={styles.reportDate}>{report.date}</div>
                  </div>
                  <div className={styles.reportValue}>{report.value}</div>
                  <div className={styles.reportStatus}>
                    <StatusIcon className={styles.statusIcon} style={{ color: statusColor }} />
                    <span style={{ color: statusColor }}>{report.status}</span>
                  </div>
                </div>
                <div className={styles.reportActions}>
                  <button className={styles.viewBtn}>
                    <FaEye />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
