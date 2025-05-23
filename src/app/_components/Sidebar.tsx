"use client";

import styled from "styled-components";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
    label: "About us",
    subItems: [
      { label: "GDG", path: "/aboutus/gdg" },
      { label: "GDG KU", path: "/aboutus/gdgku" },
      { label: "Members", path: "/aboutus/members" },
      { label: "Rules", path: "/aboutus/rules" },
      { label: "Calendar", path: "/aboutus/calendar" },
    ],
  },
  {
    label: "Official Events",
    subItems: [
      {
        label: "Google Solution Challenge",
        path: "/officialevents/googlesolutionchallenge",
      },
      {
        label: "Google Cloud Skills Boost",
        path: "/officialevents/googlecloudskillsboost",
      },
      {
        label: "Google I/O Extended",
        path: "/officialevents/googleioextended",
      },
      { label: "Devfest", path: "/officialevents/devfest" },
    ],
  },
  {
    label: "Local Events",
    subItems: [
      { label: "Branch", path: "/localevents/branch" },
      { label: "Fetch", path: "/localevents/fetch" },
      { label: "Worktree", path: "/localevents/worktree" },
      { label: "Hotfix", path: "/localevents/hotfix" },
      { label: "Merge", path: "/localevents/merge" },
    ],
  },
  {
    label: "Recruit",
    subItems: [
      { label: "SWE", path: "/recruit/swe" },
      { label: "Designer", path: "/recruit/designer" },
      { label: "DevRel", path: "/recruit/devrel" },
    ],
  },
  {
    label: "Help",
    subItems: [
      { label: "Contact", path: "/help/contact" },
      { label: "FAQ", path: "/help/faq" },
    ],
  },
];

interface Props {
  openLoginModal: () => void;
}

const Sidebar = ({ openLoginModal }: Props) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfileImage] = useState("/sidebar-profile.svg");

  const [isHovered, setIsHovered] = useState(false);

  const handleMainMenuMouseEnter = (index: number) => setHoveredIndex(index);

  const handleSubSidebarEnter = (index: number) => setHoveredIndex(index);
  const handleSubSidebarLeave = () => setHoveredIndex(null);

  const onSidebarMouseEnter = () => {
    setIsHovered(true);
    setIsSidebarOpen(true);
  };
  const onSidebarMouseLeave = () => {
    setIsHovered(false);
    setIsSidebarOpen(false);
  };

  const handleProfileClick = () => {
    openLoginModal();
  };

  return (
    <>
      {isHovered && <StyledOverlay role="Sidebar-Overlay" />}
      <StyledContainer
        className={isSidebarOpen ? "active" : ""}
        aria-label="주요 사이드바 내비게이션"
        onMouseEnter={onSidebarMouseEnter}
        onMouseLeave={onSidebarMouseLeave}>
        <StyledLogoWrapper>
          <Link href="/aboutus/calendar">
            <Image src="/logo.png" alt="GDG KU 로고" width={220} height={60} />
          </Link>
        </StyledLogoWrapper>

        <StyledNav aria-label="주요 메뉴">
          <ul>
            {menuData.map(({ label }, index) => (
              <li
                key={label}
                onMouseEnter={() => handleMainMenuMouseEnter(index)}
                tabIndex={0}
                role="button"
                onFocus={() => handleMainMenuMouseEnter(index)}>
                {label}
              </li>
            ))}
          </ul>
        </StyledNav>

        <StyledUserProfileWrapper>
          <Image src={userProfileImage} alt="사용자 프로필" width={50} height={50} onClick={handleProfileClick} />
        </StyledUserProfileWrapper>

        {hoveredIndex !== null && menuData[hoveredIndex].subItems && (
          <StyledSubNav
            className={hoveredIndex !== null ? "active" : ""}
            onMouseEnter={() => handleSubSidebarEnter(hoveredIndex)}
            onMouseLeave={handleSubSidebarLeave}
            aria-label={`${menuData[hoveredIndex].label} 서브 메뉴`}>
            <ul>
              {menuData[hoveredIndex].subItems?.map(({ label, path }) => (
                <li key={label}>
                  <Link href={path}>{label}</Link>
                </li>
              ))}
            </ul>
          </StyledSubNav>
        )}
      </StyledContainer>
    </>
  );
};

export default Sidebar;

const StyledContainer = styled.aside`
  position: fixed;
  left: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  width: 220px;
  height: 100%;

  color: #fff;
  background: linear-gradient(to right, #000, #111);
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);

  transform: translateX(0);
  transition: transform 0.3s ease;

  z-index: 999;

  &.active {
    transform: translateX(0);
  }
`;

const StyledLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    margin: 0;
    padding: 0;

    display: inline-block;

    width: 100%;
    height: auto;

    transform: scale(0.3);
    transform-origin: center;
  }
`;

const StyledNav = styled.nav`
  flex: 1;

  > ul {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    > li {
      font-size: 1rem;
      font-weight: 500;
      text-align: center;

      color: #aaa;

      transition: color 0.3s;

      cursor: pointer;

      &:hover,
      &:focus {
        color: #fff;
      }
    }
  }
`;

const StyledSubNav = styled.div`
  padding: 8rem 0 0;

  position: absolute;
  top: 0;
  left: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;

  max-width: 200px;
  height: 100%;

  background: linear-gradient(to right, #111, #222);
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);

  opacity: 0;

  transform-origin: left;
  transition: all 0.5s ease-out 0.1s;

  &.active {
    opacity: 1;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    li > a {
      font-size: 0.9rem;
      font-weight: 400;
      color: #aaa;

      transition: color 0.3s;

      &:hover,
      &:focus {
        color: #fff;
      }
    }
  }

  @media (max-width: 768px) {
    left: 100%;
    max-width: 160px;
  }
`;

const StyledUserProfileWrapper = styled.div`
  display: flex;
  justify-content: center;

  margin-bottom: 2rem;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.5);

  z-index: 10;

  transition: opacity 0.5s ease;
`;
