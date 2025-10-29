import '@/styles/globals.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

// Defina as rotas que NÃO precisam de autenticação (listas de permissão)
const PUBLIC_PAGES = ['/']; 

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Verifica se a rota atual está na lista de rotas públicas (que não precisam de login)
  const isPublicPath = PUBLIC_PAGES.includes(router.pathname);

  useEffect(() => {
    // 1. Se for uma rota pública, não precisamos de token.
    if (isPublicPath) {
      setLoading(false);
      return;
    }

    // 2. Se não for rota pública, checamos a autenticação.
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Se a página não é pública E o usuário não tem token, redireciona para a tela de login.
      // Usamos replace para evitar que a página protegida fique no histórico de navegação.
      router.replace('/login'); 
    } else {
      // Token encontrado, libera o carregamento da página protegida.
      setLoading(false);
    }
    
    // NOTA: Adicione a URL atual como dependência para re-executar a checagem 
    // se o usuário navegar entre rotas protegidas.
  }, [router, isPublicPath]);

  // Se for uma página pública, renderiza imediatamente para que o formulário de login apareça.
  if (isPublicPath) {
    return (
      <>
        <Head><title>Greenrise | Login</title></Head>
        <Component {...pageProps} />
      </>
    );
  }

  // Para páginas protegidas, mostra o indicador de carregamento enquanto espera a checagem do token.
  if (loading) {
    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', color: '#00ff9d' }}>
            <p>Carregando informações...</p>
        </div>
    );
  }

  // Se a checagem terminou e o token existe (loading é false), renderiza o componente.
  return (
    <>
      <Head><title>Greenrise</title></Head>
      <Component {...pageProps} />
    </>
  );
}
