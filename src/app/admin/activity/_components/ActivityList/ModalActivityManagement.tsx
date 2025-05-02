"use client";

import styled from "styled-components";
import ActivityTab from "./ActivityTab";
import { useState } from "react";
import { Activity } from "@/constants/activity";
import Input from "@/components/Input";

const ModalActivityManagement = () => {
  const [currentActivity, setCurrentActivity] = useState<Activity>("worktree");

  return (
    <StyledContainer>
      <StyledTabWrapper>
        <ActivityTab currentActivity={currentActivity} onActivityChange={(activity) => setCurrentActivity(activity)} />
      </StyledTabWrapper>
      <div>
        <StyledActivityInputForm>
          <Input className="activity-input" placeholder="새로운 워크트리 입력" />
          <button>추가하기</button>
        </StyledActivityInputForm>
        <div>
          <StyledActivityList>
            <li>
              <span>Website</span>
              <span className="ic-x">X</span>
            </li>
            <li>
              <span>Design System</span>
              <span>X</span>
            </li>
          </StyledActivityList>
        </div>
      </div>
    </StyledContainer>
  );
};

export default ModalActivityManagement;

const StyledContainer = styled.div`
  padding: 20px 64px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;

  width: 680px;
  height: 520px;

  > div {
    width: 100%;
  }
`;

const StyledTabWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledActivityInputForm = styled.form`
  margin-bottom: 20px;

  display: flex;
  gap: 12px;

  width: 100%;

  .activity-input {
    flex: 1;
  }

  > button {
    padding: 6px 20px;

    border-radius: 9999px;

    font-size: 14px;
    font-weight: 600;
    line-height: 21.2px;
    color: #ffffff;
    background-color: #424242;

    cursor: pointer;
  }
`;

const StyledActivityList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;

  overflow-y: auto;

  > li {
    padding: 4px 12px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    border-radius: 4px;

    background-color: rgba(217, 217, 217, 0.5);

    > span {
      font-size: 10px;
      font-weight: 500;
      line-height: 22px;
    }

    .ic-x {
      cursor: pointer;
    }
  }
`;
