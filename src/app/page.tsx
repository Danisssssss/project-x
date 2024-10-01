"use client";

import React, { useState } from "react";
import Header from "../../components/shared/header";
import Sidebar from "../../components/shared/sidebar";
import Main_page from "../../components/shared/main_page";

export default function Home() {
  const [isSidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
      setSidebarActive((prev) => !prev); // Переключаем активность сайдбара
  };

  return (
      <div className="page">
          <Header toggleSidebar={toggleSidebar} />
          <Sidebar isActive={isSidebarActive} />
          <Main_page />
      </div>
  );
}