import React from 'react';
import { Outlet } from "react-router-dom";
import Header from "../components/headerFooter/HeaderUtama";
import Footer from "../components/headerFooter/Footer";

const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;