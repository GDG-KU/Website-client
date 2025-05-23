"use client";

import styled from "styled-components";
import Pagination, { PaginationProps } from "../Pagination";

// eslint-disable-next-line
interface Props<T = any> {
  columns: {
    title: string;
    render: (row: T, idx: number) => React.ReactNode;
    width?: string | number;
    align?: "left" | "center" | "right";
  }[];
  data: T[];
  pagination?: false | PaginationProps;
}

const Table = <T,>({ columns, data, pagination }: Props<T>) => {
  return (
    <StyledContainer>
      <StyledTableWrapper>
        <StyledTable>
          <colgroup>
            {columns.map(({ width }, idx) => (
              <col key={idx} width={width} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {columns.map(({ title, align }, idx) => (
                <td key={idx} align={align}>
                  {title}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map(({ render, align }, col_idx) => (
                  <td key={col_idx} align={align}>
                    {render(row, idx)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </StyledTableWrapper>
      {pagination && (
        <StyledPaginationWrapper>
          <Pagination {...pagination} />
        </StyledPaginationWrapper>
      )}
    </StyledContainer>
  );
};

export default Table;

const StyledContainer = styled.div``;

const StyledTableWrapper = styled.div``;

const StyledTable = styled.table`
  width: 100%;

  thead > tr > td {
    font-size: 8px;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.5);
    line-height: 22px;
  }

  tbody > tr > td {
    font-size: 10px;
    font-weight: 500;
    line-height: 22px;
  }
`;

const StyledPaginationWrapper = styled.div`
  margin-top: 1rem;
`;
