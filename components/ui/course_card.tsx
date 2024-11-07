"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./course_card.module.css";
import Image from "next/image";
import { useBreadcrumbs } from "../../src/app/BreadcrumbsContext";
import { Popover, OverlayTrigger } from "react-bootstrap";

interface CourseCardProps {
  title: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ title }) => {
  const { setBreadcrumbs } = useBreadcrumbs();
  const router = useRouter();
  const [showPopover, setShowPopover] = useState(false);

  const handleClick = () => {
    setBreadcrumbs(title);
    router.push("/course/feed");
  };

  const handlePopoverToggle = () => {
    setShowPopover((prev) => !prev);
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Дополнительные действия</Popover.Header>
      <Popover.Body>Здесь можно добавить дополнительные действия.</Popover.Body>
    </Popover>
  );

  return (
    <div className={styles.course_card} onClick={handleClick}>
      <div className={styles.top}>
        <div className={styles.title}>{title}</div>
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={popover}
          show={showPopover}
          onToggle={handlePopoverToggle}
        >
          <a href="#" className={styles.more}>
            <Image src="/assets/images/more.svg" alt="" width={4} height={18} />
          </a>
        </OverlayTrigger>
      </div>
      <div className={styles.bottom}></div>
    </div>
  );
};

export default CourseCard;