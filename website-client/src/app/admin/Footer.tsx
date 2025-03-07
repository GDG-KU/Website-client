'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

export default function Footer() {
  const path = usePathname();

  return (
    <footer className={styles.footerNav}>
      <Link href="/admin/management">
        <button
          className={`${styles.navButton} ${
            path === '/admin/management' ? styles.active : ''
          }`}
        >
          멤버 포인트/활동 관리
        </button>
      </Link>
      <Link href="/admin/calendar">
        <button
          className={`${styles.navButton} ${
            path === '/admin/calendar' ? styles.active : ''
          }`}
        >
          캘린더 관리
        </button>
      </Link>
      <Link href="/admin/faq">
        <button
          className={`${styles.navButton} ${
            path === '/admin/faq' ? styles.active : ''
          }`}
        >
          FAQ 관리
        </button>
      </Link>
      <Link href="/admin/role">
        <button
          className={`${styles.navButton} ${
            path === '/admin/role' ? styles.active : ''
          }`}
        >
          Role/Authority 관리
        </button>
      </Link>
    </footer>
  );
}
