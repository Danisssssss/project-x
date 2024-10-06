import React from "react";
import styles from "./header.module.css";
import Image from "next/image";
import Link from "next/link";

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
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
                    </div>
                    <div className={styles.user}>
                        <a href="#" className={styles.plus}>
                            <Image src="/assets/images/plus.svg" alt="" width={16} height={16} />
                        </a>
                        {/* <div className={styles.user_logo}></div> */}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;