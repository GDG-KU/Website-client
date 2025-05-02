"use client";

import styled from "styled-components";
import Footer from "./_components/Footer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <StyledContainer>
      {children}
      <Footer />
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  padding: 2rem;

  width: 100%;

  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;
