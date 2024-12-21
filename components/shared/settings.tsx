"use client";

import React, { useState } from "react";
import styles from "./settings.module.css";

const Settins = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь логика отправки формы, например, через API
    console.log("Form data submitted:", formData);
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

            <div className={styles.formGroup}>
            <input
                type="textg"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Введите пароль"
                required
            />
            </div>
            <button type="submit" className={styles.button}>Изменить данные</button>
        </form>
    );
};

export default Settins;