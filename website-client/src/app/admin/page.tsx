'use client';

import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/admin/management">
          <button>멤버 포인트/활동 관리</button>
        </Link>
        <Link href="/admin/calendar">
          <button>캘린더 관리</button>
        </Link>
        <Link href="/admin/faq">
          <button>FAQ 관리</button>
        </Link>
        <Link href="/admin/role">
          <button>Role/Authority 관리</button>
        </Link>
      </div>
    </div>
  );
}
