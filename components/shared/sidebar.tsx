import React from "react";
import styles from "./sidebar.module.css";

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebar_wrapper}>
                <a href="#" className={styles.sidebar_item}>
                    <img src="/assets/images/home.svg" alt="" />
                    <span className={styles.sidebar_text}>Главная страница</span>
                </a>
                <a href="#" className={styles.sidebar_item}>
                    <img src="/assets/images/settings.svg" alt="" />
                    <span className={styles.sidebar_text}>Настройки</span>
                </a>
                <a href="#" className={styles.sidebar_item}>
                    <img src="/assets/images/exit.svg" alt="" />
                    <span className={styles.sidebar_text}>Выйти</span>
                </a> 
            </div>
        </div>
    );
};

export default Sidebar;
