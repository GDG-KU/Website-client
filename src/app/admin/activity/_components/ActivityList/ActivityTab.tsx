"use client";

import { type Activity, ACTIVITY_LIST } from "@/constants/activity";
import styled from "styled-components";

interface Props {
  currentActivity: Activity;
  onActivityChange: (activity: Activity) => void;
}

const ActivityTab = ({ currentActivity, onActivityChange }: Props) => {
  return (
    <StyledContainer>
      {ACTIVITY_LIST.map((activity) => (
        <li
          key={activity}
          className={currentActivity === activity ? "active" : undefined}
          onClick={() => onActivityChange(activity)}>
          {activity}
        </li>
      ))}
    </StyledContainer>
  );
};

export default ActivityTab;

const StyledContainer = styled.ul`
  display: flex;
  gap: 4px;

  > li {
    padding: 4px 12px;

    font-size: 12px;
    font-weight: 700;
    color: #101010;
    line-height: 120%;

    border-radius: 4px;

    cursor: pointer;

    &.active {
      background-color: #424242;
      color: #ffffff;
    }
  }
`;
