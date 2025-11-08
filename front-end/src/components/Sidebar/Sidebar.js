import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
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
import ConfirmModal from "../ConfirmModal/ConfirmModal";

export default function Sidebar({ isOpen, onClose, isCollapsed }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);
  const router = useRouter();

  // Menu items organizados por seção
  const menuItems = {
    principal: [
      { icon: faHome, label: "Início", href: "/home" },
      { icon: faLeaf, label: "Adicionar Hortaliça", href: "/growVegetable" },
      { icon: faList, label: "Lista de Hortaliças", href: "/vegetableList" },
    ],
    secundario: [
      { icon: faCamera, label: "Câmeras", href: "/cameras" },
      { icon: faFileAlt, label: "Relatórios", href: "/reports" },
      { icon: faCog, label: "Configurações", href: "/settings" },
    ],
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    setShowConfirm(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      Cookies.remove("token");
      router.push("/"); // redireciona suavemente para o login
    }
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  // Fecha a sidebar ao clicar fora (apenas mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        const menuButton = document.querySelector("[data-menu-button]");
        if (menuButton && !menuButton.contains(event.target)) {
          onClose();
        }
      }
    };

    if (isMobile && isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isMobile, isOpen, onClose]);

  // Fecha ao pressionar ESC (mobile)
  useEffect(() => {
    const handleEsc = (event) => {
      if (isMobile && event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isMobile, isOpen, onClose]);

  return (
    <>
      {/* ===== Overlay para mobile ===== */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      <aside
        ref={sidebarRef}
        className={`${styles.sidebar} ${
          isOpen ? styles.open : ""
        } ${isCollapsed ? styles.collapsed : ""}`}
      >
        {/* ===== Logo / Marca ===== */}
<div className={styles.brandSection}>
  <div className={styles.logoContainer}>
    <img
      src="/logo.jpg"
      alt="Logo GreenRise"
      className={`${styles.logo} ${isCollapsed ? styles.logoCollapsed : ""}`}
    />
  </div>

  {!isCollapsed && (
    <div className={styles.brandText}>
      <h3 className={styles.brandTitle}>GreenRise</h3>
      <p className={styles.brandSubtitle}>Gestão de Estufa</p>
    </div>
  )}
</div>
  

        {/* ===== Menu Principal ===== */}
        <nav className={styles.menuWrapper} aria-label="Menu de navegação">
          <ul className={styles.menuList}>
            {/* Seção Principal */}
            {menuItems.principal.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <li
                  key={item.href}
                  className={`${styles.menuItem} ${
                    isActive ? styles.active : ""
                  }`}
                  title={item.label}
                >
                  <Link
                    href={item.href}
                    className={styles.link}
                    onClick={() => isMobile && onClose()}
                  >
                    <span className={styles.iconWrapper}>
                      <FontAwesomeIcon icon={item.icon} />
                    </span>
                    <span className={styles.linkText}>{item.label}</span>
                    {isActive && <span className={styles.activeIndicator} />}
                  </Link>
                </li>
              );
            })}

            {/* Separador */}
            <li className={styles.separator}>
              <div className={styles.separatorLine} />
            </li>

            {/* Seção Secundária */}
            {menuItems.secundario.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <li
                  key={item.href}
                  className={`${styles.menuItem} ${
                    isActive ? styles.active : ""
                  }`}
                  title={item.label}
                >
                  <Link
                    href={item.href}
                    className={styles.link}
                    onClick={() => isMobile && onClose()}
                  >
                    <span className={styles.iconWrapper}>
                      <FontAwesomeIcon icon={item.icon} />
                    </span>
                    <span className={styles.linkText}>{item.label}</span>
                    {isActive && <span className={styles.activeIndicator} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ===== Footer com Logout ===== */}
        <div className={styles.footerSection}>
          <button
            className={`${styles.menuItem} ${styles.logout}`}
            onClick={handleLogout}
            title="Sair"
            type="button"
          >
            <span className={styles.iconWrapper}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </span>
            <span className={styles.linkText}>Sair</span>
          </button>
        </div>
      </aside>

      {/* ===== POPUP DE CONFIRMAÇÃO ===== */}
      {showConfirm && (
        <ConfirmModal
          message="Deseja realmente sair? Você será desconectado da sua conta GreenRise."
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
          confirmText="Sair"
          cancelText="Cancelar"
        />
      )}
    </>
  );
}
