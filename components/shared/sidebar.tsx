"use client";

import React, { useState } from "react";
import styles from "./sidebar.module.css";
import Image from "next/image";

const Sidebar = ({ isActive }: { isActive: boolean }) => {
    const [activeItem, setActiveItem] = useState<string>("home");

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, item: string) => {
        event.preventDefault();  // предотвращаем переход
        setActiveItem(item);     // устанавливаем активный элемент
    };

    return (
        <div className={`${styles.sidebar} ${isActive ? styles.active : ""}`}>
            <div className={styles.wrapper}>
                <a href="#" className={`${styles.item} ${activeItem === "home" ? styles.active : ""}`}
                    onClick={(e) => handleClick(e, "home")}>
                    <Image src="/assets/images/home.svg" alt="" width={18} height={19} />
                    <span className={styles.text}>Главная страница</span>
                </a>
                <a href="#" className={`${styles.item} ${activeItem === "settings" ? styles.active : ""}`}
                    onClick={(e) => handleClick(e, "settings")}>
                    <Image src="/assets/images/settings.svg" alt="" width={18} height={20} />
                    <span className={styles.text}>Настройки</span>
                </a>
                <a href="#" className={`${styles.item} ${activeItem === "exit" ? styles.active : ""}`}
                    onClick={(e) => handleClick(e, "exit")}>
                    <Image src="/assets/images/exit.svg" alt="" width={18} height={18} />
                    <span className={styles.text}>Выйти</span>
                </a>
            </div>
        </div>
    );
};

export default Sidebar;