'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './Sidebar.css';
import LoginModal from '@/components/LoginModal';
import { useAppSelector } from '@/store/hooks';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const Sidebar: React.FC = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState<boolean>(false);

  const [userProfileImage, setUserProfileImage] = useState('/sidebar-profile.svg');

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/mypage/profile/image`, {
          method: 'GET',
        });
        if (!res.ok) throw new Error('프로필 이미지 조회 실패');
        const imageUrl: string = await res.json();
        setUserProfileImage(imageUrl || '/sidebar-profile.svg');
      } catch (error) {
        console.error('[Sidebar] 프로필 이미지 조회 실패:', error);
        setUserProfileImage('/sidebar-profile.svg');
      }
    };

    if (isLoggedIn) {
      fetchProfileImage();
    } else {
      setUserProfileImage('/sidebar-profile.svg');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setIsSidebarHovered(false);
    setIsSidebarOpen(false);
  }, []);

  const handleMainMenuMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };
  const handleMainMenuMouseLeave = () => {
  };

  const handleSubSidebarEnter = (index: number) => {
    setHoveredIndex(index);
  };
  const handleSubSidebarLeave = () => {
    setHoveredIndex(null);
  };

  const onSidebarMouseEnter = () => {
    setIsSidebarHovered(true);
    setIsSidebarOpen(true);
  };
  const onSidebarMouseLeave = () => {
    setIsSidebarHovered(false);
    setIsSidebarOpen(false);
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      window.location.href = '/mypage';
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      {/* 오버레이 */}
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

        {/* 프로필 아이콘 (로그인 상태면 사용자 프로필, 아니면 기본 이미지) */}
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
