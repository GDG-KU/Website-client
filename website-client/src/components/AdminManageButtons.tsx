import React from 'react';
import './AdminManageButtons.css'

export default function AdminManageButtons(){
    return(
        <div className="admin-navigation-wrapper">
            <button className="admin-navigation">멤버/포인트 관리</button>
            <button className="admin-navigation">캘린더 관리</button>
            <button className="admin-navigation">FAQ 관리</button>
        </div>
    )
}