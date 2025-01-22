'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './Sidebar.css';
import LoginModal from '@/components/LoginModal';
import { useAppSelector } from '@/store/hooks';

interface SubItem {
  label: string;
  path: string;
}

interface MainItem {
  label: string;
  subItems?: SubItem[];
}

const menuData: MainItem[] = [
  {
    label: 'About us',
    subItems: [
      { label: 'GDG', path: '/aboutus/gdg' },
      { label: 'GDG KU', path: '/aboutus/gdgku' },
      { label: 'Members', path: '/aboutus/members' },
      { label: 'Rules', path: '/aboutus/rules' },
      { label: 'Calendar', path: '/aboutus/calendar' },
    ],
  },
  {
    label: 'Official Events',
    subItems: [
      { label: 'Google Solution Challenge', path: '/officialevents/googlesolutionchallenge' },
      { label: 'Google Cloud Skills Boost', path: '/officialevents/googlecloudskillsboost' },
      { label: 'Google I/O Extended', path: '/officialevents/googleioextended' },
      { label: 'Devfest', path: '/officialevents/devfest' },
    ],
  },
  {
    label: 'Local Events',
    subItems: [
      { label: 'Branch', path: '/localevents/branch' },
      { label: 'Fetch', path: '/localevents/fetch' },
      { label: 'Worktree', path: '/localevents/worktree' },
      { label: 'Hotfix', path: '/localevents/hotfix' },
      { label: 'Merge', path: '/localevents/merge' },
    ],
  },
  {
    label: 'Recruit',
    subItems: [
      { label: 'SWE', path: '/recruit/swe' },
      { label: 'Designer', path: '/recruit/designer' },
      { label: 'DevRel', path: '/recruit/devrel' },
    ],
  },
  {
    label: 'Help',
    subItems: [
      { label: 'Contact', path: '/help/contact' },
      { label: 'FAQ', path: '/help/faq' },
    ],
  },
];

const Sidebar: React.FC = () => {
  // Redux로부터 로그인 여부
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  // 로그인 모달 열림 여부
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState<boolean>(false);

  useEffect(() => {
    setIsSidebarHovered(false);
    setIsSidebarOpen(false);
  }, []);

  const handleMainMenuMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };
  const handleMainMenuMouseLeave = () => {
    // 필요하면 처리
  };

  const handleSubSidebarEnter = (index: number) => {
    setHoveredIndex(index);
  };
  const handleSubSidebarLeave = () => {
    setHoveredIndex(null);
  };

  // 사이드바 전체 영역 호버
  const onSidebarMouseEnter = () => {
    setIsSidebarHovered(true);
    setIsSidebarOpen(true);
  };
  const onSidebarMouseLeave = () => {
    setIsSidebarHovered(false);
    setIsSidebarOpen(false);
  };

  // 프로필 클릭
  const handleProfileClick = () => {
    if (isLoggedIn) {
      // 로그인된 상태 → 마이페이지
      window.location.href = '/mypage';
    } else {
      // 미로그인 상태 → 로그인 모달
      setIsLoginModalOpen(true);
    }
  };

  // 사용자 프로필 이미지
  const userProfileImage = '/sidebar-profile.svg';

  return (
    <>
      {/* 오버레이: 사이드바 호버 중 .open 처리 + 로그인 모달이 열려도 어둡게 */}
      <div
        className={`sidebar-overlay ${
          isSidebarHovered || isLoginModalOpen ? 'open' : ''
        }`}
      />

      <aside
        className={`main-sidebar ${isSidebarOpen ? 'open' : ''}`}
        aria-label="주요 사이드바 내비게이션"
        onMouseEnter={onSidebarMouseEnter}
        onMouseLeave={onSidebarMouseLeave}
      >
        {/* 로고 영역 */}
        <div className="logo-area">
          <Link href="/aboutus/calendar">
            <picture>
              <source srcSet="/logo.webp" type="image/webp" />
              <img src="/logo.png" alt="GDG KU 로고" className="logo-image" />
            </picture>
          </Link>
        </div>

        {/* 메인 메뉴 */}
        <nav className="main-menu" aria-label="주요 메뉴">
          {menuData.map((item, index) => (
            <div
              key={item.label}
              className="main-menu-item"
              onMouseEnter={() => handleMainMenuMouseEnter(index)}
              onMouseLeave={handleMainMenuMouseLeave}
              tabIndex={0}
              role="button"
              onFocus={() => handleMainMenuMouseEnter(index)}
              onBlur={handleMainMenuMouseLeave}
            >
              {item.label}
            </div>
          ))}
        </nav>

        {/* 프로필 아이콘 */}
        <div className="user-area">
          <Image
            src={userProfileImage}
            alt="사용자 프로필"
            width={50}
            height={50}
            className="user-profile-image"
            onClick={handleProfileClick}
          />
        </div>

        {/* 서브 사이드바 */}
        {hoveredIndex !== null && menuData[hoveredIndex].subItems && (
          <div
            className={`sub-sidebar ${hoveredIndex !== null ? 'open' : ''}`}
            onMouseEnter={() => handleSubSidebarEnter(hoveredIndex)}
            onMouseLeave={handleSubSidebarLeave}
            aria-label={`${menuData[hoveredIndex].label} 서브 메뉴`}
          >
            <div className="sub-menu-items">
              {menuData[hoveredIndex].subItems!.map((sub) => (
                <Link key={sub.label} href={sub.path} className="sub-menu-link">
                  {sub.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
