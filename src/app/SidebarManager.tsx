"use client";

import React, { useState } from "react";
import Header from "../../components/shared/header";
import Sidebar from "../../components/shared/sidebar";

const SidebarManager = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  return (
    <div className="page">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isActive={isSidebarActive} />
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default SidebarManager;