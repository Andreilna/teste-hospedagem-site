import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Função simples para decodificar payload do JWT
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (err) {
    return null;
  }
}

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/"); // redireciona se não tiver token
        return;
      }

      const decoded = decodeJWT(token);
      const now = Date.now().valueOf() / 1000;

      if (!decoded || decoded.exp < now) {
        localStorage.removeItem("token");
        router.replace("/"); // redireciona se token inválido ou expirado
        return;
      }

      setLoading(false); // token válido
    }, [router]);

    if (loading) return null; // ou um loading spinner
    return <Component {...props} />;
  };
}
