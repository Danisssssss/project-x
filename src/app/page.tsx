import React from "react";
import Header from "../../components/shared/header";
import Sidebar from "../../components/shared/sidebar";
import Main_page from "../../components/shared/main_page";
// import Button from "../../components/ui/button";

export default function Home() {
  return (
    <div className="page">
      <Header/>
      <Sidebar/>
      <Main_page/>
    </div>
  );
}
