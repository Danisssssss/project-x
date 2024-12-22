import React, { useState } from "react";
import styles from "./modal.module.css";

interface ModalProps {
  onClose: () => void;
  onCreate: (title: string) => void;
}

const Modal: React.FC<ModalProps> = ({ onClose, onCreate }) => {
  const [courseTitle, setCourseTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!courseTitle.trim()) {
      setError("Название курса не может быть пустым");
      return;
    }

    try {
      await onCreate(courseTitle);
      setError(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Не удалось создать курс. Попробуйте еще раз.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Создать курс</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="text"
          placeholder="Название курса (обязательно)"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          className={styles.input}
        />
        <div className={styles.buttons}>
          <button onClick={onClose} className={styles.cancel}>
            Отмена
          </button>
          <button onClick={handleCreate} className={styles.create}>
            Создать
          </button>
        </div>
      </div>
    </div>
  );
};


export default Modal;