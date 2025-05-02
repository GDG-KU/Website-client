"use client";

import { useState } from "react";
import LoginModal from "./LoginModal";
import Sidebar from "./Sidebar";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
}

const RootContainer = ({ children }: Props) => {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isOverlayed = isSidebarHovered || isLoginModalOpen;

  return (
    <>
      {isOverlayed && <StyledOverlay className={isOverlayed ? "active" : ""} />}

      <StyledContainer>
        <div className="sidebar-wrapper">
          <Sidebar
            openLoginModal={() => setIsLoginModalOpen(true)}
            handleSidebarHovered={(val) => setIsSidebarHovered(val)}
          />
        </div>
        {children}
      </StyledContainer>
      <LoginModal isOpen={isLoginModalOpen} handleClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default RootContainer;

const StyledContainer = styled.main`
  display: flex;

  .sidebar-wrapper {
    flex: 0 0 220px;

    @media (max-width: 768px) {
      flex: 0 0 180px;
    }
  }
`;

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.5);

  opacity: 0;
  z-index: 10;

  transition: opacity 0.5s ease;

  &.active {
    opacity: 1;
  }
`;
