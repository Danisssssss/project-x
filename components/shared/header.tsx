import React, { useEffect, useState } from "react";
import styles from "./header.module.css";
import Image from "next/image";
import Link from "next/link";
import { useBreadcrumbs } from "../../src/app/BreadcrumbsContext";
import Modal from "../modal/Modal"; // Подключите компонент модального окна (создадим его ниже)

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { breadcrumbs } = useBreadcrumbs();
  const [userName, setUserName] = useState<string>("Гость");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Состояние для модального окна

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      const fetchUserRole = async () => {
        try {
          const response = await fetch("/api/current-role", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserRole(data.role || "");
          } else {
            console.error("Ошибка при получении роли пользователя");
          }
        } catch (error) {
          console.error("Ошибка при запросе роли пользователя:", error);
        }
      };
      fetchUserRole();
    } else {
      setIsAuthenticated(false);
    }

    const user = localStorage.getItem("user");
    if (user) {
      try {
        const { fullName } = JSON.parse(user);
        setUserName(fullName || "Гость");
      } catch (error) {
        console.error("Ошибка при чтении данных пользователя:", error);
        setUserName("Гость");
      }
    }
  }, []);

  const handleCreateCourse = async (title: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });
      if (response.ok) {
        console.log("Курс успешно создан");
        alert(`Курс "${title}" успешно создан!`);
        setIsModalOpen(false);
        window.location.reload();
      } else {
        console.error("Ошибка при создании курса");
      }
    } catch (error) {
      console.error("Ошибка при создании курса:", error);
    }
  };  

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.nav}>
            <div className={styles.menu} onClick={toggleSidebar}>
              <Image src="/assets/images/menu.svg" alt="" width={20} height={14} />
            </div>
            <Link href="/" className={styles.logo}>
              <Image src="/logo.svg" alt="" width={120} height={30} />
            </Link>
            <div className={styles.breadcrumbs}>
              <Image src="/assets/images/arrow.svg" alt="" width={6} height={12} />
              <a href="#">{breadcrumbs}</a>
            </div>
          </div>
          <div className={styles.user}>
            {isAuthenticated && userRole === "Преподаватель" && (
              <a href="#" className={styles.plus} onClick={() => setIsModalOpen(true)}>
                <Image src="/assets/images/plus.svg" alt="" width={16} height={16} />
              </a>
            )}
            <span className={styles.name}>{userName}</span>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateCourse}
        />
      )}
    </header>
  );
};

export default Header;