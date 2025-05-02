"use client";

import styled from "styled-components";
import Footer from "./_components/Footer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <StyledContainer>
      <div>{children}</div>
      <Footer />
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  height: 100vh;

  > div:first-child {
    max-height: calc(100vh - 144px);
    padding: 1rem;
    flex: 1;
  }
`;
