"use client";  // Клиентский компонент

import React, { useState } from "react";
import Header from "../../components/shared/header";
import Sidebar from "../../components/shared/sidebar";

const SidebarManager = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive); // Меняем состояние боковой панели
  };

  return (
    <div className="page">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isActive={isSidebarActive} />
      {children}
    </div>
  );
};

export default SidebarManager;