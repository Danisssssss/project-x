import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./sidebar.module.css";
import Image from "next/image";
import { useBreadcrumbs } from "../../src/app/BreadcrumbsContext";

interface SidebarProps {
  isActive: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isActive }) => {
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [activeLink, setActiveLink] = useState("/");

  useEffect(() => {
    // Загружаем активный пункт из localStorage при первом рендере
    const savedActiveLink = localStorage.getItem("activeLink");
    if (savedActiveLink) {
      setActiveLink(savedActiveLink);
    }
  }, []);

  const handleClick = (href: string, label: string) => {
    setActiveLink(href);
    setBreadcrumbs(label);
    localStorage.setItem("activeLink", href); // Сохраняем активный пункт
    router.push(href);
  };

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
        <div
          className={`${styles.item} ${activeLink === "/settings" ? styles.active : ""}`}
          onClick={() => handleClick("/settings", "Настройки")}
        >
          <Image src="/assets/images/settings.svg" alt="" width={18} height={20} />
          <span className={styles.text}>Настройки</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;