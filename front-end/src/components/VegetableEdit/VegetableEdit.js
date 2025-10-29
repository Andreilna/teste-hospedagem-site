// src/components/VegetableEdit/VegetableEdit.jsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  FaLeaf,
  FaClock,
  FaRegClock,
  FaTags,
  FaFlask,
  FaTint,
  FaPlus,
  FaTrash,
  FaSeedling,
  FaSave,
  FaUndo,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowLeft,
} from "react-icons/fa";

// Helper da API
import { apiFetch } from "@/services/api";

import styles from "@/components/VegetableEdit/VegetableEdit.module.css";

const VegetableEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [form, setForm] = useState({
    nome_hortalica: "",
    tempo_estimado: "",
    tempo_real: "",
    tipo_hortalica: "",
    fertilizantes: [{ fertilizante: "", quantidade: "", unidade: "g" }],
    nivel: { 
      nivel_agua: "",
      nivel_fertilizante: ""
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const tipoOptions = ["Folhosa", "Fruto", "Raiz", "Bulbo", "Leguminosa", "Outros"];

  // Função para buscar dados da hortaliça
  const fetchHortalica = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch(`/hortalicas/${id}`);
      
      if (response.hortalica) {
        const hortalica = response.hortalica;
        setForm({
          nome_hortalica: hortalica.nome_hortalica || "",
          tempo_estimado: hortalica.tempo_estimado || "",
          tempo_real: hortalica.tempo_real || "",
          tipo_hortalica: hortalica.tipo_hortalica || "",
          fertilizantes: hortalica.fertilizantes && hortalica.fertilizantes.length > 0 
            ? hortalica.fertilizantes.map(f => ({
                fertilizante: f.fertilizante || "",
                quantidade: f.quantidade || "",
                unidade: f.unidade || "g"
              }))
            : [{ fertilizante: "", quantidade: "", unidade: "g" }],
          nivel: { 
            nivel_agua: hortalica.nivel?.nivel_agua || "",
            nivel_fertilizante: hortalica.nivel?.nivel_fertilizante || ""
          },
        });
      }
    } catch (err) {
      console.error("Erro ao buscar hortaliça:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados quando o componente monta
  useEffect(() => {
    fetchHortalica();
  }, [id]);

  function setField(path, value) {
    setForm((prev) => {
      const next = { ...prev };
      const keys = path.split(".");
      let ref = next;
      for (let i = 0; i < keys.length - 1; i++) {
        ref[keys[i]] = { ...ref[keys[i]] };
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function validate() {
    const e = {};
    if (!form.nome_hortalica.trim()) e.nome_hortalica = "Informe o nome.";
    if (!form.tipo_hortalica.trim()) e.tipo_hortalica = "Selecione o tipo.";

    const te = form.tempo_estimado === "" ? null : Number(form.tempo_estimado);
    const tr = form.tempo_real === "" ? null : Number(form.tempo_real);

    if (te !== null && (isNaN(te) || te < 0)) e.tempo_estimado = "Valor inválido.";
    if (tr !== null && (isNaN(tr) || tr < 0)) e.tempo_real = "Valor inválido.";

    const na = Number(form.nivel.nivel_agua);
    if (isNaN(na) || na < 0 || na > 100) e.nivel_agua = "0 a 100.";

    form.fertilizantes.forEach((f, idx) => {
      if (f.fertilizante && !f.fertilizante.trim())
        e[`fertilizantes_${idx}`] = "Remova ou preencha.";
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function addFertilizante() {
    setForm((prev) => ({
      ...prev,
      fertilizantes: [...prev.fertilizantes, { fertilizante: "", quantidade: "", unidade: "g" }],
    }));
  }

  function removeFertilizante(index) {
    setForm((prev) => ({
      ...prev,
      fertilizantes: prev.fertilizantes.filter((_, i) => i !== index),
    }));
  }

  function handleReset() {
    fetchHortalica(); // Recarrega os dados originais
    setErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    const payload = {
      nome_hortalica: form.nome_hortalica.trim(),
      tempo_estimado: form.tempo_estimado === "" ? null : Number(form.tempo_estimado),
      tempo_real: form.tempo_real === "" ? null : Number(form.tempo_real),
      tipo_hortalica: form.tipo_hortalica.trim(),
      fertilizantes: form.fertilizantes
        .map((f) => ({ 
          fertilizante: (f.fertilizante || "").trim(),
          quantidade: f.quantidade || 0,
          unidade: f.unidade || "g"
        }))
        .filter((f) => f.fertilizante !== ""),
      nivel: { 
        nivel_agua: (form.nivel?.nivel_agua === "" || form.nivel?.nivel_agua === null || form.nivel?.nivel_agua === undefined) ? null : Number(form.nivel.nivel_agua),
        nivel_fertilizante: (form.nivel?.nivel_fertilizante === "" || form.nivel?.nivel_fertilizante === null || form.nivel?.nivel_fertilizante === undefined) ? null : Number(form.nivel.nivel_fertilizante)
      },
    };

    try {
      await apiFetch(`/hortalicas/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      alert("Hortaliça atualizada com sucesso!");
      router.push("/vegetableList");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Carregando dados da hortaliça...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationTriangle className={styles.errorIcon} />
        <p>Erro ao carregar hortaliça: {error}</p>
        <button onClick={fetchHortalica} className={styles.retryButton}>
          Tentar novamente
        </button>
        <button onClick={() => router.push("/vegetableList")} className={styles.backButton}>
          <FaArrowLeft /> Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div className={styles.editPage}>
      <div className={styles.header}>
        <button 
          onClick={() => router.push("/vegetableList")} 
          className={styles.backButton}
        >
          <FaArrowLeft /> Voltar
        </button>
        <div className={styles.headerContent}>
          <div className={styles.iconWrap}>
            <FaSeedling />
          </div>
          <div>
            <h1 className={styles.title}>Editar Hortaliça</h1>
            <p className={styles.subtitle}>Atualize os dados da hortaliça conforme necessário.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.editCard}>
        {/* Grid */}
        <div className={styles.grid}>
          {/* Nome */}
          <div className={styles.field}>
            <label className={styles.label}>
              <FaLeaf /> Nome da hortaliça <span className={styles.req}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.input} ${errors.nome_hortalica ? styles.isError : ""}`}
              placeholder="Ex.: Alface Crespa"
              value={form.nome_hortalica}
              onChange={(e) => setField("nome_hortalica", e.target.value)}
            />
            {errors.nome_hortalica && (
              <span className={`${styles.help} ${styles.error}`}>{errors.nome_hortalica}</span>
            )}
          </div>

          {/* Tipo */}
          <div className={styles.field}>
            <label className={styles.label}>
              <FaTags /> Tipo de hortaliça <span className={styles.req}>*</span>
            </label>
            <select
              className={`${styles.input} ${errors.tipo_hortalica ? styles.isError : ""}`}
              value={form.tipo_hortalica}
              onChange={(e) => setField("tipo_hortalica", e.target.value)}
            >
              <option value="" disabled>Selecione…</option>
              {tipoOptions.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
            {errors.tipo_hortalica && (
              <span className={`${styles.help} ${styles.error}`}>{errors.tipo_hortalica}</span>
            )}
          </div>

          {/* Tempo estimado */}
          <div className={styles.field}>
            <label className={styles.label}><FaClock /> Tempo estimado (dias)</label>
            <input
              type="number"
              min={0}
              className={`${styles.input} ${errors.tempo_estimado ? styles.isError : ""}`}
              placeholder="Ex.: 60"
              value={form.tempo_estimado}
              onChange={(e) => setField("tempo_estimado", e.target.value)}
            />
            {errors.tempo_estimado && (
              <span className={`${styles.help} ${styles.error}`}>{errors.tempo_estimado}</span>
            )}
          </div>

          {/* Tempo real */}
          <div className={styles.field}>
            <label className={styles.label}><FaRegClock /> Tempo real (dias)</label>
            <input
              type="number"
              min={0}
              className={`${styles.input} ${errors.tempo_real ? styles.isError : ""}`}
              placeholder="Ex.: 57"
              value={form.tempo_real}
              onChange={(e) => setField("tempo_real", e.target.value)}
            />
            {errors.tempo_real && (
              <span className={`${styles.help} ${styles.error}`}>{errors.tempo_real}</span>
            )}
          </div>

          {/* Nível de água */}
          <div className={styles.field}>
            <label className={styles.label}>
              <FaTint /> Nível de água (L)
            </label>
            <input
              type="number"
              min={0}
              max={200}
              className={`${styles.input} ${errors.nivel_agua ? styles.isError : ""}`}
              placeholder="Ex.: 75"
              value={form.nivel?.nivel_agua || ""}
              onChange={(e) => setField("nivel.nivel_agua", e.target.value)}
            />
            {errors.nivel_agua && (
              <span className={`${styles.help} ${styles.error}`}>{errors.nivel_agua}</span>
            )}
          </div>

          {/* Nível de fertilizante */}
          <div className={styles.field}>
            <label className={styles.label}>
              <FaFlask /> Nível de fertilizante (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              className={`${styles.input} ${errors.nivel_fertilizante ? styles.isError : ""}`}
              placeholder="Ex.: 50"
              value={form.nivel?.nivel_fertilizante || ""}
              onChange={(e) => setField("nivel.nivel_fertilizante", e.target.value)}
            />
            {errors.nivel_fertilizante && (
              <span className={`${styles.help} ${styles.error}`}>{errors.nivel_fertilizante}</span>
            )}
          </div>
        </div>

        {/* Fertilizantes */}
        <div className={styles.fert}>
          <div className={styles.fertHead}>
            <label className={styles.label}><FaFlask /> Fertilizantes</label>
            <button type="button" onClick={addFertilizante} className={`${styles.btn} ${styles.ghost}`}>
              <FaPlus /> <span>Adicionar</span>
            </button>
          </div>

          <div className={styles.fertList}>
            {form.fertilizantes.map((item, idx) => (
              <div key={idx} className={styles.fertRow}>
                <input
                  type="text"
                  className={`${styles.input} ${styles.flex1} ${errors[`fertilizantes_${idx}`] ? styles.isError : ""}`}
                  placeholder="Ex.: NPK 10-10-10"
                  value={item.fertilizante}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((prev) => {
                      const next = { ...prev };
                      const arr = [...next.fertilizantes];
                      arr[idx] = { ...arr[idx], fertilizante: val };
                      next.fertilizantes = arr;
                      return next;
                    });
                  }}
                />
                <input
                  type="number"
                  min={0}
                  className={`${styles.input} ${styles.quantity}`}
                  placeholder="Qtd"
                  value={item.quantidade}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((prev) => {
                      const next = { ...prev };
                      const arr = [...next.fertilizantes];
                      arr[idx] = { ...arr[idx], quantidade: val };
                      next.fertilizantes = arr;
                      return next;
                    });
                  }}
                />
                <select
                  className={`${styles.input} ${styles.unit}`}
                  value={item.unidade}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((prev) => {
                      const next = { ...prev };
                      const arr = [...next.fertilizantes];
                      arr[idx] = { ...arr[idx], unidade: val };
                      next.fertilizantes = arr;
                      return next;
                    });
                  }}
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="L">L</option>
                </select>
                <button
                  type="button"
                  aria-label={`Remover fertilizante #${idx + 1}`}
                  className={`${styles.btn} ${styles.danger} ${styles.icon}`}
                  onClick={() => removeFertilizante(idx)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button 
            type="submit" 
            className={`${styles.btn} ${styles.primary}`}
            disabled={saving}
          >
            {saving ? <FaSpinner className={styles.spinner} /> : <FaSave />} 
            <span>{saving ? "Salvando..." : "Salvar"}</span>
          </button>
          <button type="button" onClick={handleReset} className={`${styles.btn} ${styles.secondary}`}>
            <FaUndo /> <span>Restaurar</span>
          </button>
        </div>

        <p className={styles.foot}>
          Dica: Campos marcados com * são obrigatórios. Você pode deixar tempos em branco para enviar como <code>null</code>.
        </p>
      </form>
    </div>
  );
};

export default VegetableEdit;
