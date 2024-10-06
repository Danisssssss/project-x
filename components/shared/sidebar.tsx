"use client";

import React, { useState } from "react";
import styles from "./sidebar.module.css";
import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
    const [activeLink, setActiveLink] = useState("/");
  
    const handleClick = (href: string) => {
      setActiveLink(href);
    };
  
    return (
        <div className={styles.sidebar}>
            <div className={styles.wrapper}>
                <Link href="/" className={`${styles.item} ${activeLink === "/" ? styles.active : ""}`}
                onClick={() => handleClick("/")}>
                    <Image src="/assets/images/home.svg" alt="" width={18} height={19} />
                    <span className={styles.text}>Главная страница</span>
                </Link>
                <Link href="/settings" className={`${styles.item} ${activeLink === "/settings" ? styles.active : ""}`}
                onClick={() => handleClick("/settings")}>
                    <Image src="/assets/images/settings.svg" alt="" width={18} height={20} />
                    <span className={styles.text}>Настройки</span>
                </Link>
                <a href="#" className={`${styles.item} ${activeLink === "/exit" ? styles.active : ""}`}
                onClick={() => handleClick("/exit")}>
                    <Image src="/assets/images/exit.svg" alt="" width={18} height={18} />
                    <span className={styles.text}>Выйти</span>
                </a>
            </div>
        </div>
    );
};

export default Sidebar;