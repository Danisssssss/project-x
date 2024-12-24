import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./sidebar.module.css";
import Image from "next/image";
import { useBreadcrumbs } from "../../src/app/BreadcrumbsContext";

import LoginModal from "../modal/LoginModal";
import RegisterModal from "../modal/RegisterModal";
import ConfirmModal from "../modal/ConfirmModal"; // Импортируем модальное окно подтверждения

interface SidebarProps {
  isActive: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isActive }) => {
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [activeLink, setActiveLink] = useState("/");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Состояние для модального окна подтверждения
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    const savedActiveLink = localStorage.getItem("activeLink");
    if (savedActiveLink) {
      setActiveLink(savedActiveLink);
    }
  }, []);

  const handleClick = (href: string, label: string) => {
    setActiveLink(href);
    setBreadcrumbs(label);
    localStorage.setItem("activeLink", href);
    router.push(href);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    router.push("/home"); // Перенаправление на главную страницу
    setIsConfirmModalOpen(false);
    window.location.reload();
  };

  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  return (
    <div className={`${styles.sidebar} ${isActive ? styles.active : ""}`}>
      <div className={styles.wrapper}>
        <div
          className={`${styles.item} ${activeLink === "/" ? styles.active : ""}`}
          onClick={() => handleClick("/", "Главная страница")}
        >
          <Image src="/assets/images/home.svg" alt="" width={18} height={19} />
          <span className={styles.text}>Главная страница</span>
        </div>
        {isAuthenticated && (
          <div
            className={`${styles.item} ${activeLink === "/settings" ? styles.active : ""}`}
            onClick={() => handleClick("/settings", "Личный кабинет")}
          >
            <Image src="/assets/images/settings.svg" alt="" width={18} height={20} />
            <span className={styles.text}>Личный кабинет</span>
          </div>
        )}
        {!isAuthenticated && (
          <a href="#" className={styles.item}
            onClick={(e) => {
              e.preventDefault();
              openLoginModal();
            }}>
            <Image src="/assets/images/exit.svg" alt="" width={18} height={18} />
            <span className={styles.text}>Войти</span>
          </a>
        )}
        {!isAuthenticated && (
          <a href="#" className={styles.item}
            onClick={(e) => {
              e.preventDefault();
              openRegisterModal();
            }}>
            <Image src="/assets/images/exit.svg" alt="" width={18} height={18} />
            <span className={styles.text}>Зарегистрироваться</span>
          </a>
        )}
        {isAuthenticated && (
          <a href="#" className={styles.item} onClick={openConfirmModal}>
            <Image src="/assets/images/exit.svg" alt="" width={18} height={18} />
            <span className={styles.text}>Выйти</span>
          </a>
        )}
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleLogout}
        title="Вы уверены, что хотите выйти?"
        description=""
      />
    </div>
  );
};

export default Sidebar;