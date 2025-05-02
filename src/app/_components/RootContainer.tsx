"use client";

import { useState } from "react";
import LoginModal from "./LoginModal";
import Sidebar from "./Sidebar";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
}

const RootContainer = ({ children }: Props) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <StyledContainer>
        <div className="sidebar-wrapper">
          <Sidebar openLoginModal={() => setIsLoginModalOpen(true)} />
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
