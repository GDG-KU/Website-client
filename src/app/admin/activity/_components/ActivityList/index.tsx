"use client";

import styled from "styled-components";
import ActivityTab from "./ActivityTab";
import { useState } from "react";
import type { Activity } from "@/constants/activity";
import Modal from "@/components/Modal";
import ModalActivityManagement from "./ModalActivityManagement";

interface Props {
  onActivityChange: (activityId: number) => void;
}

const ActivityList = ({ onActivityChange }: Props) => {
  const [currentActivity, setCurrentActivity] = useState<Activity>("worktree");
  const [modalState, setModalState] = useState(false);

  return (
    <StyledContainer>
      <StyledTabBlock>
        <div />
        <ActivityTab currentActivity={currentActivity} onActivityChange={(activity) => setCurrentActivity(activity)} />
        <div className="ic-setting" onClick={() => setModalState(true)}></div>
      </StyledTabBlock>
      <div>
        <StyledActivityList>
          <li onClick={() => onActivityChange(1)}>Website</li>
          <li>Design System</li>
          <li>병아리 프로젝트</li>
        </StyledActivityList>
      </div>

      <Modal isOpen={!!modalState} onClose={() => setModalState(false)}>
        <ModalActivityManagement />
      </Modal>
    </StyledContainer>
  );
};

export default ActivityList;

const StyledContainer = styled.div`
  padding: 1rem;
  flex: 1;

  background-color: #f2f2f2;

  border-radius: 16px;
`;

const StyledTabBlock = styled.div`
  margin-bottom: 24px;

  display: flex;
  justify-content: space-between;

  .ic-setting {
    width: 20px;
    height: 20px;
    background-color: #ffff00;

    cursor: pointer;
  }
`;
const StyledActivityList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;

  > li {
    padding: 4px 12px;

    font-size: 10px;
    font-weight: 700;
    line-height: 22px;

    background-color: rgba(217, 217, 217, 0.2);
    cursor: pointer;
  }
`;
