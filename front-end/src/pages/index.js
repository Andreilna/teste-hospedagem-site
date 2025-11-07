import { useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";
import styles from "../styles/Login.module.css";
import Cookies from "js-cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/user/login", { email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        Cookies.set("token", response.data.token, { expires: 2 });
        router.push("/home");
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError(err.response?.data?.error || "Email ou senha incorretos");
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

        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
