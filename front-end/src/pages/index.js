import { useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";
import styles from "../styles/Login.module.css";
import Cookies from "js-cookie";
import { useToast } from "../components/ToastContainer/ToastContainer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  // Função auxiliar para tratar erros de forma silenciosa
  const handleLoginError = (err) => {
    let displayMessage = "Email ou senha incorretos";
    
    // Verifica se é um erro do Axios
    if (err.response) {
      // Erro com resposta do servidor
      const status = err.response.status;
      const errorMessage = err.response.data?.error || "";
      
      // Remove emojis e caracteres especiais da mensagem do backend
      const cleanErrorMessage = errorMessage.replace(/[❌✅]/g, "").trim();
      
      if (status === 404) {
        displayMessage = "Este email não está cadastrado.";
      } else if (status === 401) {
        displayMessage = "Senha incorreta. Tente novamente.";
      } else if (status === 400) {
        displayMessage = cleanErrorMessage || "Dados inválidos. Verifique suas informações.";
      } else if (status === 500) {
        displayMessage = "Erro no servidor. Tente novamente mais tarde.";
      } else {
        displayMessage = cleanErrorMessage || "Erro ao fazer login. Tente novamente.";
      }
    } else if (err.request) {
      // Erro de rede - requisição foi feita mas não houve resposta
      displayMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
    } else {
      // Erro ao configurar a requisição
      displayMessage = "Erro ao processar login. Tente novamente.";
    }
    
    return displayMessage;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/user/login", { email, password });

      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
        Cookies.set("token", response.data.token, { expires: 2 });
        setLoading(false);
        router.push("/home");
        return;
      }
    } catch (err) {
      // Tratamento de erro silencioso
      // Previne que o erro seja exibido como erro não tratado
      try {
        const displayMessage = handleLoginError(err);
        
        // Define o erro e mostra o toast
        setError(displayMessage);
        showToast(displayMessage, "error", 5000);
        
        // Log apenas em desenvolvimento (não em produção)
        if (process.env.NODE_ENV === "development") {
          console.log("Erro de login tratado:", {
            status: err.response?.status,
            message: err.response?.data?.error,
            userMessage: displayMessage,
          });
        }
      } catch (errorHandlerErr) {
        // Fallback caso haja erro no tratamento do erro
        setError("Erro ao processar login. Tente novamente.");
        showToast("Erro ao processar login. Tente novamente.", "error", 5000);
      }
    } finally {
      // Garante que o loading seja sempre desativado
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Carregando...</p>
        </div>
      )}
      <form className={styles.box} onSubmit={handleLogin}>
        {/* Logo adicionada aqui */}
        <img
          src="/logo.jpg"
          alt="Logo GreenRise"
          className={styles.logo}
        />

        <h2 className={styles.title}>Login - GreenRise</h2>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
          disabled={loading}
        />

        <button type="submit" className={styles.button} disabled={loading}>
          Entrar
        </button>

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.error}>{error}</p>
          </div>
        )}
      </form>
    </div>
  );
}
