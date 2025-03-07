import React from 'react';
import Footer from './Footer';
import './AdminHomePage.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-container">
      {children}
      <Footer />
    </div>
  );
}
