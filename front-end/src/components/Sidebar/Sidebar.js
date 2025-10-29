// components/Sidebar/Sidebar.tsx
import Link from "next/link";
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
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>G</div>

      <nav className={styles.menuWrapper} aria-label="Menu principal">
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <FontAwesomeIcon icon={faHome} />
            <Link href="/home" className={styles.link}>
              Início
            </Link>
          </li>

          <Link href="/growVegetable">
            <li className={styles.menuItem}>
              <FontAwesomeIcon icon={faLeaf} />
              <div className={styles.link}>Adicionar Hortaliça</div>
            </li>
          </Link>
          <Link href="/vegetableList">
            <li className={styles.menuItem}>
              <FontAwesomeIcon icon={faList} />
              <div className={styles.link}>Lista de Hortaliças</div>
            </li>
          </Link>
          <Link href="/cameras">
            <li className={styles.menuItem}>
              <FontAwesomeIcon icon={faCamera} />
              <div className={styles.link}>Câmeras</div>
            </li>
          </Link>
          <Link href="/reports">
            <li className={styles.menuItem}>
              <FontAwesomeIcon icon={faFileAlt} />
              <div className={styles.link}>Relatórios</div>
            </li>
          </Link>
          <Link href="/settings">
            <li className={styles.menuItem}>
              <FontAwesomeIcon icon={faCog} />
              <div className={styles.link}>Configurações</div>
            </li>
          </Link>

          <Link href="/">
            <li className={styles.menuItem}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              <div className={styles.link}>Sair</div>
            </li>
          </Link>
        </ul>
      </nav>
    </aside>
  );
}
