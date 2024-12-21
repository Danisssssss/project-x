import React, { useEffect, useState } from "react";
import styles from "./header.module.css";
import Image from "next/image";
import Link from "next/link";
import { useBreadcrumbs } from "../../src/app/BreadcrumbsContext";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { breadcrumbs } = useBreadcrumbs();
  const [userName, setUserName] = useState<string>("Гость");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Состояние для проверки авторизации

  useEffect(() => {
    // Проверка наличия токена в localStorage для определения авторизации
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // Пользователь авторизован
    } else {
      setIsAuthenticated(false); // Пользователь не авторизован
    }

    // Попытка получить данные пользователя из localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const { fullName } = JSON.parse(user); // Получаем имя пользователя
        setUserName(fullName || "Гость (не могу прачитать имя)");
      } catch (error) {
        console.error("Ошибка при чтении данных пользователя:", error);
        setUserName("Гость не вошел");
      }
    }
  }, []);

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
            {isAuthenticated && (
              <a href="#" className={styles.plus}>
                <Image src="/assets/images/plus.svg" alt="" width={16} height={16} />
              </a>
            )}
            <span className={styles.name}>{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;