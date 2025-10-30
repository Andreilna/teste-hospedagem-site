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

    const token = localStorage.getItem('token') || Cookies.get('token');

    if (!token) {
      router.replace('/login'); // Redireciona se não tiver token
    } else {
      setLoading(false); // Token existe, libera acesso
    }
  }, [router, isPublicPath]);

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
