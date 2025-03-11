'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

export default function Footer() {
  const path = usePathname();

  return (
    <footer className={styles.footerNav}>
      <div className={styles.leftButtons}>
        <Link href="/admin/management">
          <button
            className={`${styles.navButton} ${
              path === '/admin/management' ? styles.active : ''
            }`}
          >
            멤버 포인트 관리
          </button>
        </Link>
        <Link href="/admin/activity">
          <button
            className={`${styles.navButton} ${
              path === '/admin/activity' ? styles.active : ''
            }`}
          >
            멤버 활동 관리
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
      </div>

      <Link href="/admin/qualification" className={styles.iconLink}>
        <Image
          src="/qualification-icon.svg"
          alt="자격 관리"
          width={40}
          height={40}
          className={`${styles.icon} ${
            path === '/admin/qualification' ? styles.iconActive : ''
          }`}
        />
      </Link>
    </footer>
  );
}
