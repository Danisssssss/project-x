"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface BreadcrumbsContextProps {
  breadcrumbs: string;
  setBreadcrumbs: (text: string) => void;
}

const BreadcrumbsContext = createContext<BreadcrumbsContextProps | undefined>(undefined);

export const BreadcrumbsProvider = ({ children }: { children: ReactNode }) => {
  const [breadcrumbs, setBreadcrumbs] = useState("Главная страница");

  useEffect(() => {
    // Загружаем значение из localStorage при первом рендере
    const savedBreadcrumbs = localStorage.getItem("breadcrumbs");
    if (savedBreadcrumbs) {
      setBreadcrumbs(savedBreadcrumbs);
    }
  }, []);

  const updateBreadcrumbs = (text: string) => {
    setBreadcrumbs(text);
    // Сохраняем новое значение в localStorage
    localStorage.setItem("breadcrumbs", text);
  };

  return (
    <BreadcrumbsContext.Provider value={{ breadcrumbs, setBreadcrumbs: updateBreadcrumbs }}>
      {children}
    </BreadcrumbsContext.Provider>
  );
};

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbsContext);
  if (!context) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbsProvider");
  }
  return context;
};