"use client";

import styled from "styled-components";
import { useState } from "react";
import UserDetail from "./_components/UserDetail";
import UserList from "./_components/UserList";

export default function UserPointManagementPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(1);

  return (
    <StyledContainer>
      <StyledContents>
        <div>
          <UserList selectedUserId={selectedUserId} handleSelectedUserId={(userId) => setSelectedUserId(userId)} />
        </div>
        <div>{selectedUserId && <UserDetail userId={selectedUserId} />}</div>
      </StyledContents>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  padding: 2rem;

  display: flex;
  flex-direction: column;
`;

const StyledContents = styled.div`
  display: flex;
  gap: 2rem;

  > div {
    width: 100%;
  }
`;
