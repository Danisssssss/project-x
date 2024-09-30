"use client";

import React, { useState } from "react";
import styles from "./sidebar.module.css";
import Image from "next/image";

const Sidebar = () => {
    const [activeItem, setActiveItem] = useState<string>("home");

    return (
        <div className={styles.sidebar}>
            <div className={styles.wrapper}>
                <a 
                    href="#" 
                    className={`${styles.item} ${activeItem === "home" ? styles.active : ""}`}
                    onClick={() => setActiveItem("home")}
                >
                    <Image src="/assets/images/home.svg" alt="" width={18} height={19}/>
                    <span className={styles.text}>Главная страница</span>
                </a>
                <a 
                    href="#" 
                    className={`${styles.item} ${activeItem === "settings" ? styles.active : ""}`}
                    onClick={() => setActiveItem("settings")}
                >
                    <Image src="/assets/images/settings.svg" alt="" width={18} height={20}/>
                    <span className={styles.text}>Настройки</span>
                </a>
                <a 
                    href="#" 
                    className={`${styles.item} ${activeItem === "exit" ? styles.active : ""}`}
                    onClick={() => setActiveItem("exit")}
                >
                    <Image src="/assets/images/exit.svg" alt="" width={18} height={18}/>
                    <span className={styles.text}>Выйти</span>
                </a> 
            </div>
        </div>
    );
};

export default Sidebar;