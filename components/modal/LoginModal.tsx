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
  
    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }
  
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Успешный вход:", data); // Выводим данные в консоль
        localStorage.setItem("token", data.token); // Сохраняем токен
        if (data.fullName) {
          localStorage.setItem("user", JSON.stringify({ fullName: data.fullName, email })); // Сохраняем имя пользователя
        }
        onClose(); // Закрываем модальное окно
        window.location.reload(); // Перезагружаем страницу
      } else {
        console.error("Ошибка авторизации:", data.message);
        setError(data.message || "Ошибка при авторизации");
      }
    } catch (err) {
      console.error("Ошибка авторизации:", err);
      setError("Произошла ошибка, попробуйте позже");
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
