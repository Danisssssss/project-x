import React from "react";
import styles from "./header.module.css";

const Header = () => {
    return (
        <header className={styles.header}>
            <div className="container">
                <div className={styles.wrapper}>
                    <div className={styles.nav}>
                        <a href="#" className={styles.menu}>
                            <img src="/assets/images/menu.png" alt="" />
                        </a>
                        <a href="#" className={styles.logo}>
                            <img src="/logo.png" alt="" />
                        </a>
                    </div>
                    <div className={styles.user}>
                        <a href="#" className={styles.plus}>
                            <img src="/assets/images/plus.png" alt="" />
                        </a>
                        <div className={styles.user_logo}></div>
                    </div>
                </div>
            </div>
        </header>
    )
};

export default Header;