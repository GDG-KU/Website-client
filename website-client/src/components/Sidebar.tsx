'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './Sidebar.css';

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

  // 마우스를 올린 메인 메뉴 index
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // 사이드바 열림 상태 (기본 false → 사실상 "숨김" 상태, but always visible + translateX로 처리)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  // 사이드바 전체 hover 상태
  const [isSidebarHovered, setIsSidebarHovered] = useState<boolean>(false);

  useEffect(() => {
    // 컴포넌트(페이지) 로드 시점에 오버레이/사이드바 상태 초기화
    setIsSidebarHovered(false);
    setIsSidebarOpen(false);
  }, []);


  // 메인 메뉴에 마우스 올라갔을 때
  const handleMainMenuMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };
  // 메인 메뉴에서 마우스 나갔을 때
  const handleMainMenuMouseLeave = () => {
    // 필요에 따라 처리
  };

  // 서브 사이드바 영역으로 마우스가 들어감
  const handleSubSidebarEnter = (index: number) => {
    setHoveredIndex(index);
  };
  // 서브 사이드바 영역에서 마우스가 나감
  const handleSubSidebarLeave = () => {
    setHoveredIndex(null);
  };

  // 사이드바 영역에 마우스가 들어옴 → 열림
  const onSidebarMouseEnter = () => {
    setIsSidebarHovered(true);
    setIsSidebarOpen(true);
  };
  // 사이드바 영역에서 나감 → 닫힘
  const onSidebarMouseLeave = () => {
    setIsSidebarHovered(false);
    setIsSidebarOpen(false);
  };

  // 사용자 프로필 이미지
  const userProfileImage = '/profile.svg';

  return (
    <>
      {/* 오버레이: 사이드바에 마우스가 올라간 동안만 .open 처리 */}
      <div className={`sidebar-overlay ${isSidebarHovered ? 'open' : ''}`} />

      <aside
        className={`main-sidebar ${isSidebarOpen ? 'open' : ''}`}
        aria-label="주요 사이드바 내비게이션"
        onMouseEnter={onSidebarMouseEnter}
        onMouseLeave={onSidebarMouseLeave}
      >
        {/* 로고 영역 */}
        <div className="logo-area">
          <Link href="/overview">
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

        {/* 마이페이지 아이콘 */}
        <div className="user-area">
          <Link href="/mypage">
            <Image
              src={userProfileImage}
              alt="사용자 프로필"
              width={50}
              height={50}
              className="user-profile-image"
            />
          </Link>
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
                <Link
                  key={sub.label}
                  href={sub.path}
                  className="sub-menu-link"
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
