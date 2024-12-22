import React from "react";
import styles from "./confirm_modal.module.css";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, description }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>
            Отмена
          </button>
          <button className={styles.confirm} onClick={onConfirm}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
