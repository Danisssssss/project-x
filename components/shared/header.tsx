import React from "react";
import styles from "./header.module.css";
import Image from "next/image";
import Link from "next/link";
import { useBreadcrumbs } from "../../src/app/BreadcrumbsContext";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { breadcrumbs } = useBreadcrumbs();

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
        </div>
      </div>
    </header>
  );
};

export default Header;