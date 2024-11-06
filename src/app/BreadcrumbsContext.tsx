"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Интерфейс, описывающий контекст
interface BreadcrumbsContextProps {
  breadcrumbs: string;
  setBreadcrumbs: (text: string) => void;
}

// Создаем контекст с дефолтным значением null
const BreadcrumbsContext = createContext<BreadcrumbsContextProps | undefined>(undefined);

export const BreadcrumbsProvider = ({ children }: { children: ReactNode }) => {
  const [breadcrumbs, setBreadcrumbs] = useState("Главная страница");

  return (
    <BreadcrumbsContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbsContext.Provider>
  );
};

// Хук для использования контекста
export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbsContext);
  if (!context) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbsProvider");
  }
  return context;
};