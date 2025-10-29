import { useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";
import styles from "../styles/Login.module.css";
import Cookies from "js-cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/user/login", { email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        Cookies.set("token", response.data.token, { expires: 2 });
        window.location.href = "/home";
      }
    } catch (err) {
      setError("Usuário ou senha inválidos!");
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.box} onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
