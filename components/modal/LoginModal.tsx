import React, { useState } from "react";
import styles from "./loginModal.module.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Успешный логин, сохраняем токен в localStorage
      localStorage.setItem("token", data.token);
      onClose(); // Закрыть модальное окно
    } else {
      // Если ошибка, отображаем сообщение
      setError(data.message || "Ошибка при авторизации");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <form className={styles.form} onSubmit={handleLogin}>
          <h2 className={styles.title}>Вход</h2>
          <input
            type="email"
            placeholder="Почта"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.submitButton}>
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;