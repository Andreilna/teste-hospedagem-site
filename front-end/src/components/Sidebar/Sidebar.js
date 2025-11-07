// components/Sidebar/Sidebar.js
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Sidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faLeaf,
  faCamera,
  faFileAlt,
  faCog,
  faSignOutAlt,
  faList,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    setShowConfirm(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token"); // limpa o token do localStorage
      document.cookie = "token=; max-age=0; path=/; HttpOnly"; // limpa o cookie
      window.location.href = "/"; // redireciona para a tela inicial
    }
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <Image
            src="/logo.jpg"
            alt="Logo GreenRise"
            width={70}
            height={70}
            className={styles.logo}
            priority
          />
        </div>

        <nav className={styles.menuWrapper} aria-label="Menu principal">
          <ul className={styles.menuList}>
            <li className={styles.menuItem}>
              <FontAwesomeIcon icon={faHome} />
              <Link href="/home" className={styles.link}>
                Início
              </Link>
            </li>

            <li className={styles.menuItem}>
              <FontAwesomeIcon icon={faLeaf} />
              <Link href="/growVegetable" className={styles.link}>
                Adicionar Hortaliça
              </Link>
            </li>

            <li className={styles.menuItem}>
              <FontAwesomeIcon icon={faList} />
              <Link href="/vegetableList" className={styles.link}>
                Lista de Hortaliças
              </Link>
            </li>

            <li className={styles.menuItem}>
              <FontAwesomeIcon icon={faCamera} />
              <Link href="/cameras" className={styles.link}>
                Câmeras
              </Link>
            </li>

            <li className={styles.menuItem}>
              <FontAwesomeIcon icon={faFileAlt} />
              <Link href="/reports" className={styles.link}>
                Relatórios
              </Link>
            </li>

            <li className={styles.menuItem}>
              <FontAwesomeIcon icon={faCog} />
              <Link href="/settings" className={styles.link}>
                Configurações
              </Link>
            </li>

            <li className={`${styles.menuItem} ${styles.logout}`} onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span className={styles.link}>Sair</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* ===== POPUP DE CONFIRMAÇÃO ===== */}
      {showConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <h3 className={styles.confirmTitle}>Deseja realmente sair?</h3>
            <p className={styles.confirmText}>
              Você será desconectado da sua conta GreenRise.
            </p>
            <div className={styles.confirmButtons}>
              <button
                className={`${styles.confirmBtn} ${styles.cancel}`}
                onClick={cancelLogout}
              >
                Cancelar
              </button>
              <button
                className={`${styles.confirmBtn} ${styles.confirm}`}
                onClick={confirmLogout}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
