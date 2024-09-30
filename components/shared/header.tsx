"use client";

import React from "react";
import styles from "./header.module.css";
import Image from "next/image";

const Header = () => {
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
    };
    return (
        <header className={styles.header}>
            <div className="container">
                <div className={styles.wrapper}>
                    <div className={styles.nav}>
                        <a href="#" className={styles.menu} onClick={handleClick}>
                            <Image src="/assets/images/menu.svg" alt="" width={20} height={14}/>
                        </a>
                        <a href="/" className={styles.logo}>
                            <Image src="/logo.svg" alt="" width={120} height={30}/>
                        </a>
                    </div>
                    <div className={styles.user}>
                        <a href="#" className={styles.plus} onClick={handleClick}>
                            <Image src="/assets/images/plus.svg" alt="" width={16} height={16}/>
                        </a>
                        <div className={styles.user_logo}></div>
                    </div>
                </div>
            </div>
        </header>
    )
};

export default Header;