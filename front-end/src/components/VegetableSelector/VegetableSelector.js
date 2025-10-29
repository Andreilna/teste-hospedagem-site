import React, { useState, useEffect } from 'react';
import { FaSeedling, FaLeaf, FaCarrot, FaAppleAlt, FaPepperHot, FaRadish, FaCircle } from 'react-icons/fa';
import { apiFetch } from '@/services/api';
import styles from './VegetableSelector.module.css';

const VegetableSelector = ({ onVegetableSelect, selectedVegetable }) => {
  const [vegetables, setVegetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapeamento de tipos de hortaliças para ícones
  const getVegetableIcon = (tipo) => {
    const iconMap = {
      'Folhosa': FaLeaf,
      'Fruto': FaAppleAlt,
      'Raiz': FaCarrot,
      'Leguminosa': FaCircle,
      'Outros': FaSeedling
    };
    return iconMap[tipo] || FaSeedling;
  };

  // Mapeamento de cores para tipos de hortaliças
  const getVegetableColor = (tipo) => {
    const colorMap = {
      'Folhosa': '#4CAF50',
      'Fruto': '#FF9800',
      'Raiz': '#FF5722',
      'Bulbo': '#9C27B0',
      'Leguminosa': '#8BC34A',
      'Outros': '#607D8B'
    };
    return colorMap[tipo] || '#607D8B';
  };

  useEffect(() => {
    fetchVegetables();
  }, []);

  // Auto-seleciona a primeira hortaliça quando carregar
  useEffect(() => {
    if (vegetables.length > 0 && !selectedVegetable) {
      onVegetableSelect(vegetables[0]);
    }
  }, [vegetables, selectedVegetable, onVegetableSelect]);

  const fetchVegetables = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/hortalicas');
      setVegetables(response.hortalicas || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar hortaliças:', err);
      setError('Erro ao carregar hortaliças');
    } finally {
      setLoading(false);
    }
  };

  const handleVegetableClick = (vegetable) => {
    onVegetableSelect(vegetable);
  };

  if (loading) {
    return (
      <div className={styles.selector}>
        <div className={styles.loading}>
          <FaSeedling className={styles.loadingIcon} />
          <span>Carregando hortaliças...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.selector}>
        <div className={styles.error}>
          <span>{error}</span>
          <button onClick={fetchVegetables} className={styles.retryBtn}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (vegetables.length === 0) {
    return (
      <div className={styles.selector}>
        <div className={styles.empty}>
          <FaSeedling className={styles.emptyIcon} />
          <span>Nenhuma hortaliça cadastrada</span>
          <p>Cadastre uma hortaliça para começar a monitorar</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.selector}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <FaSeedling className={styles.titleIcon} />
          Selecionar Hortaliça
        </h3>
        <p className={styles.subtitle}>Escolha uma hortaliça para visualizar no dashboard</p>
      </div>
      
      <div className={styles.vegetableGrid}>
        {vegetables.map((vegetable) => {
          const IconComponent = getVegetableIcon(vegetable.tipo_hortalica);
          const color = getVegetableColor(vegetable.tipo_hortalica);
          const isSelected = selectedVegetable && selectedVegetable._id === vegetable._id;
          
          return (
            <div
              key={vegetable._id}
              className={`${styles.vegetableCard} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleVegetableClick(vegetable)}
              style={{ '--vegetable-color': color }}
            >
              <div className={styles.cardIcon}>
                <IconComponent />
              </div>
              <div className={styles.cardContent}>
                <h4 className={styles.vegetableName}>{vegetable.nome_hortalica}</h4>
                <p className={styles.vegetableType}>{vegetable.tipo_hortalica}</p>
                {vegetable.tempo_estimado && (
                  <p className={styles.vegetableTime}>
                    {vegetable.tempo_estimado} dias estimados
                  </p>
                )}
              </div>
              {isSelected && (
                <div className={styles.selectedIndicator}>
                  <div className={styles.checkmark}>✓</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VegetableSelector;
