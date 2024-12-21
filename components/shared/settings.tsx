"use client";

import React, { useState, useEffect } from "react";
import styles from "./settings.module.css";

const Settings = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "", // Добавляем email
  });

  useEffect(() => {
    // Получение данных пользователя из localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const { fullName, email } = JSON.parse(user); // Получаем имя и email пользователя
        setFormData({
          fullName: fullName || "",
          email: email || "", // Заполняем email
        });
      } catch (error) {
        console.error("Ошибка при чтении данных пользователя:", error);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email) {
      alert("Имя и email обязательны для обновления");
      return;
    }

    try {
      // Отправка данных на сервер
      const response = await fetch("/api/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email, // Отправляем email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Если данные успешно обновлены, сохраняем имя в localStorage
        localStorage.setItem("user", JSON.stringify({ fullName: formData.fullName, email: formData.email }));
        alert("Данные успешно изменены");
        window.location.reload();
      } else {
        console.error("Ошибка обновления данных:", data.message);
        alert(`Произошла ошибка при обновлении данных: ${data.message}`);
      }
    } catch (err) {
      console.error("Ошибка при отправке данных:", err);
      alert("Произошла ошибка при отправке данных");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 className={styles.title}>Профиль</h1>

      <div className={styles.formGroup}>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Введите ваше имя"
          required
        />
      </div>

      <button type="submit" className={styles.button}>Изменить данные</button>
    </form>
  );
};

export default Settings;