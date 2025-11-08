import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ message, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'warning' }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.iconContainer}>
          <FaExclamationTriangle className={styles.icon} />
        </div>
        <h3 className={styles.title}>Confirmar ação</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          <button className={`${styles.button} ${styles.cancel}`} onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`${styles.button} ${styles.confirm}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

