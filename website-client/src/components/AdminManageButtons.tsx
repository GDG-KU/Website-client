"use client";
import React from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import './AdminManageButtons.css';

const AdminManageButtons: React.FC = () => {
    const currentPath = usePathname();

    return(
        <div className="admin-navigation-wrapper">
            <Link href="/admin/management" className={`admin-navigation ${currentPath.includes('/management') ? "active" : ""}`}>멤버/포인트 관리</Link>
            <Link href="/admin/calendar" className={`admin-navigation ${currentPath.includes('/calendar') ? "active" : ""}`}>캘린더 관리</Link>
            {/* 나중에 페이지 추가되면 링크 바꿔줄 것*/}
            <Link href="/" className={`admin-navigation ${currentPath.includes('/') ? "active" : ""}`}>FAQ 관리</Link>
        </div>
    )
}

export default AdminManageButtons;