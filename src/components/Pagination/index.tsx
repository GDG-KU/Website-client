"use client";

import styled from "styled-components";

export interface PaginationProps {
  page?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
}

const PAGE_COUNT = 5;

const Pagination = ({ page = 1, pageSize = 10, total = 0, onChange }: PaginationProps) => {
  const lastPage = Math.ceil(total / pageSize);

  return (
    <StyledContainer>
      {page > 3 && <span>...</span>}
      {Array.from({ length: PAGE_COUNT }, (_, idx) => page + idx - 2).map((i) => {
        if (i < 1 || i > lastPage) return null;

        return (
          <button
            className={["page", page === i ? "active" : ""].join(" ")}
            key={i}
            onClick={(e) => {
              e.preventDefault();

              if (onChange) {
                onChange(i, pageSize);
              }
            }}>
            {i}
          </button>
        );
      })}
      {page < lastPage - 2 && <span>...</span>}
    </StyledContainer>
  );
};

export default Pagination;

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;

  > button.page {
    padding: 4px 8px;

    font-size: 10px;
    font-weight: 700;
    color: rgba(16, 16, 16, 0.6);
    line-height: 120%;

    background-color: #f0f0f0;

    border-radius: 4px;

    &.active {
      color: rgba(0, 0, 0);
      background-color: #d9d9d9;
    }
  }
`;
