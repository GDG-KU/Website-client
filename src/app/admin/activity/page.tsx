"use client";

import styled from "styled-components";
import ActivityList from "./_components/ActivityList";
import { useState } from "react";
import ActivityDetail from "./_components/ActivityDetail";

export default function UserActivityManagementPage() {
  const [selectedActivityId, setSelectedActivityId] = useState<number>(1);

  return (
    <StyledContainer>
      <ActivityList onActivityChange={(activityId) => setSelectedActivityId(activityId)} />
      {selectedActivityId && <ActivityDetail />}
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  gap: 12px;

  height: 100%;
`;
