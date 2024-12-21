import React, { useState, useEffect } from "react";
import styles from "./registerModal.module.css";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Role {
    role_id: number;
    role_name: string;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRole, setSelectedRole] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        if (isOpen) {
            fetch("/api/role")
                .then((response) => response.json())
                .then((data) => setRoles(data))
                .catch((error) => console.error("Ошибка загрузки ролей:", error));
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRole) {
            alert("Выберите роль!");
            return;
        }

        const payload = { ...formData, role_id: selectedRole };

        try {
            const response = await fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Пользователь зарегистрирован!");
                onClose();
            } else {
                const error = await response.json();
                alert(`Ошибка: ${error.message}`);
            }
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            alert("Не удалось зарегистрировать пользователя.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    ×
                </button>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h2 className={styles.title}>Регистрация</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Имя"
                        className={styles.input}
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className={styles.input}
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        className={styles.input}
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="role"
                        className={styles.input}
                        value={selectedRole || ""}
                        onChange={(e) => setSelectedRole(Number(e.target.value))}
                        required
                    >
                        <option value="" disabled>
                            Выберите роль
                        </option>
                        {roles.map((role) => (
                            <option key={role.role_id} value={role.role_id}>
                                {role.role_name}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className={styles.submitButton}>
                        Зарегистрироваться
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterModal;