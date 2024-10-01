"use client";

import React, { useState } from "react";
import Header from "../../components/shared/header";
import Sidebar from "../../components/shared/sidebar";
import Home_page from "../../components/shared/home_page";

export default function Home() {
  const [isSidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
      setSidebarActive((prev) => !prev); // Переключаем активность сайдбара
  };

  return (
      <>
          <Header toggleSidebar={toggleSidebar} />
          <Sidebar isActive={isSidebarActive} />
          <Home_page />
      </>
  );
}