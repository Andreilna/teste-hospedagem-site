import '@/styles/globals.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Cookies from 'js-cookie';

// Rotas públicas (login, etc.)
const PUBLIC_PAGES = ['/'];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const isPublicPath = PUBLIC_PAGES.includes(router.pathname);

  useEffect(() => {
    if (isPublicPath) {
      setLoading(false);
      return;
    }

    const checkToken = () => {
      const token = localStorage.getItem('token') || Cookies.get('token');

      if (!token) {
        router.replace('/'); // Redireciona para / se não tiver token
        return false;
      }
      return true;
    };

    // Verifica token inicial
    if (!checkToken()) {
      return;
    }

    setLoading(false); // Token existe, libera acesso

    // Monitora mudanças no localStorage (para detectar quando token é removido)
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        // Token foi removido
        router.replace('/');
      }
    };

    // Listener para mudanças no localStorage (entre abas)
    window.addEventListener('storage', handleStorageChange);

    // Monitora mudanças no token periodicamente (para mesma aba)
    const interval = setInterval(() => {
      if (!checkToken()) {
        clearInterval(interval);
      }
    }, 2000); // Verifica a cada 2 segundos (menos frequente)

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router, isPublicPath]);

  // Verifica token sempre que a rota mudar
  useEffect(() => {
    if (!isPublicPath) {
      const token = localStorage.getItem('token') || Cookies.get('token');
      if (!token) {
        router.replace('/');
      }
    }
  }, [router.pathname, isPublicPath, router]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', color: '#00ff9d' }}>
        Carregando informações...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Greenrise</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
