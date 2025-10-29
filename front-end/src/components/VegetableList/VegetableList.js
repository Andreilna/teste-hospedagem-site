// src/components/VegetableList/VegetableList.jsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  FaLeaf,
  FaClock,
  FaRegClock,
  FaTags,
  FaFlask,
  FaTint,
  FaSeedling,
  FaTrash,
  FaEdit,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

// Helper da API
import { apiFetch } from "@/services/api";

import styles from "@/components/VegetableList/VegetableList.module.css";

const VegetableList = () => {
  const router = useRouter();
  const [hortalicas, setHortalicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar hortaliças
  const fetchHortalicas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch("/hortalicas");
      setHortalicas(response.hortalicas || []);
    } catch (err) {
      console.error("Erro ao buscar hortaliças:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para editar hortaliça
  const handleEdit = (id) => {
    router.push(`/editVegetable?id=${id}`);
  };

  // Função para deletar hortaliça
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta hortaliça?")) {
      return;
    }

    try {
      await apiFetch(`/hortalicas/${id}`, {
        method: "DELETE",
      });
      alert("Hortaliça excluída com sucesso!");
      fetchHortalicas(); // Recarrega a lista
    } catch (err) {
      console.error("Erro ao excluir hortaliça:", err);
      alert(err.message);
    }
  };

  // Carrega as hortaliças quando o componente monta
  useEffect(() => {
    fetchHortalicas();
  }, []);

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Função para renderizar fertilizantes
  const renderFertilizantes = (fertilizantes) => {
    if (!fertilizantes || fertilizantes.length === 0) {
      return <span className={styles.noData}>Nenhum fertilizante cadastrado</span>;
    }
    
    return (
      <div className={styles.fertilizantesList}>
        {fertilizantes.map((fert, index) => (
          <span key={index} className={styles.fertilizanteTag}>
            {fert.fertilizante}
            {fert.quantidade && (
              <span className={styles.fertilizanteQuantity}>
                ({fert.quantidade}{fert.unidade || 'g'})
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Carregando hortaliças...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationTriangle className={styles.errorIcon} />
        <p>Erro ao carregar hortaliças: {error}</p>
        <button onClick={fetchHortalicas} className={styles.retryButton}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (hortalicas.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <FaSeedling className={styles.emptyIcon} />
        <h3>Nenhuma hortaliça cadastrada</h3>
        <p>Comece cadastrando sua primeira hortaliça!</p>
      </div>
    );
  }

  return (
    <div className={styles.vegetableListPage}>
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <FaSeedling />
        </div>
        <div>
          <h1 className={styles.title}>Lista de Hortaliças</h1>
          <p className={styles.subtitle}>
            {hortalicas.length} hortaliça{hortalicas.length !== 1 ? "s" : ""} cadastrada{hortalicas.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className={styles.vegetablesGrid}>
        {hortalicas.map((hortalica) => (
          <div key={hortalica._id} className={styles.vegetableCard}>
            {/* Header do card */}
            <div className={styles.cardHeader}>
              <div className={styles.vegetableInfo}>
                <h3 className={styles.vegetableName}>
                  <FaLeaf /> {hortalica.nome_hortalica}
                </h3>
                <span className={styles.vegetableType}>
                  <FaTags /> {hortalica.tipo_hortalica}
                </span>
              </div>
              <div className={styles.cardActions}>
                <button
                  className={styles.actionButton}
                  title="Editar hortaliça"
                  onClick={() => handleEdit(hortalica._id)}
                >
                  <FaEdit />
                </button>
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  title="Excluir hortaliça"
                  onClick={() => handleDelete(hortalica._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {/* Informações principais */}
            <div className={styles.cardContent}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>
                    <FaClock /> Tempo Estimado
                  </label>
                  <span className={styles.infoValue}>
                    {hortalica.tempo_estimado ? `${hortalica.tempo_estimado} dias` : "N/A"}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>
                    <FaRegClock /> Tempo Real
                  </label>
                  <span className={styles.infoValue}>
                    {hortalica.tempo_real ? `${hortalica.tempo_real} dias` : "N/A"}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>
                    <FaTint /> Nível de Água
                  </label>
                  <span className={styles.infoValue}>
                    {hortalica.nivel?.nivel_agua !== null && hortalica.nivel?.nivel_agua !== undefined ? `${hortalica.nivel.nivel_agua}L` : "Não definido"}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>
                    <FaFlask /> Nível de Fertilizante
                  </label>
                  <span className={styles.infoValue}>
                    {hortalica.nivel?.nivel_fertilizante !== null && hortalica.nivel?.nivel_fertilizante !== undefined ? `${hortalica.nivel.nivel_fertilizante}%` : "Não definido"}
                  </span>
                </div>

              </div>

              {/* Fertilizantes */}
              <div className={styles.fertilizantesSection}>
                <label className={styles.infoLabel}>
                  <FaFlask /> Fertilizantes
                </label>
                {renderFertilizantes(hortalica.fertilizantes)}
              </div>

              {/* Data de criação */}
              <div className={styles.dateInfo}>
                <small>
                  Cadastrado em: {formatDate(hortalica.createdAt)}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VegetableList;
