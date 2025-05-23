"use client";

import styled from "styled-components";

type Value = string | number;

interface Props<T extends Value> {
  items: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}

const Tab = <T extends Value>({ items, value, onChange }: Props<T>) => {
  return (
    <StyledContainer>
      <StyledTabList>
        {items.map((item) => (
          <li
            key={item.value}
            className={value === item.value ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              if (onChange) {
                onChange(item.value);
              }
            }}>
            {item.label}
          </li>
        ))}
      </StyledTabList>
    </StyledContainer>
  );
};

export default Tab;

const StyledContainer = styled.div``;

const StyledTabList = styled.ul`
  display: flex;
  gap: 4px;

  li {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 72px;
    height: 40px;

    border: none;
    border-radius: 8px;

    font-size: 12px;
    font-weight: 700;
    color: #101010;
    background-color: #f2f2f2;

    cursor: pointer;

    &.active {
      color: #ffffff;
      background-color: #424242;
    }
  }
`;
