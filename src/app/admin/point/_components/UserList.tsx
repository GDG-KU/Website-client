"use client";

import Input from "@/components/Input";
import { Role, ROLE_LIST } from "@/constants/user";
import { Pagination } from "@/types/pagination";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

import { useQuery } from "@tanstack/react-query";
import { apiInstance } from "@/modules/axios";
import { UserInfoResponseDto } from "@/types/dtos/user";

interface Props {
  selectedUserId: number | null;
  handleSelectedUserId: (userId: number | null) => void;
}

const UserList = ({ selectedUserId, handleSelectedUserId }: Props) => {
  const [filter, setFilter] = useState<{ keyword?: string; role: "ALL" | Role }>({
    role: "ALL",
  });
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 10 });

  const searchParams = useSearchParams();

  const { data } = useQuery({
    queryKey: ["/user", filter, pagination],
    queryFn: async () => {
      const { data } = await apiInstance.get<{ data: UserInfoResponseDto[]; max_size: number }>("/user", {
        params: { page: pagination.page, role: filter.role },
      });

      return data ?? { data: [], max_size: 0 };
    },
  });

  return (
    <StyledContainer>
      <StyledFilter>
        <Input placeholder="검색하기" style={{ width: 240 }} />
        <ul>
          {["ALL", ...ROLE_LIST].map((role) => (
            <li
              key={role}
              className={role === filter.role ? "active" : ""}
              onClick={() => {
                setFilter((prev) => ({ ...prev, role: role as Role }));
                setPagination((prev) => ({ ...prev, current: 1 }));
              }}>
              {role}
            </li>
          ))}
        </ul>
      </StyledFilter>
      <StyledContents>
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>레벨</th>
              <th>포지션</th>
              <th>포인트</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map(({ id, nickname, roles }) => {
              const roleString = roles.map((r) => r.role).join(" / ");
              const totalPoints = roles.reduce((sum, r) => sum + r.point, 0);

              return (
                <tr key={id} onClick={() => handleSelectedUserId(id !== selectedUserId ? id : null)}>
                  <td>{nickname}</td>
                  <td>{roleString}</td>
                  <td>{totalPoints}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <StyledPagination>
          {Array.from({ length: 5 }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                setPagination((prev) => ({ ...prev, page }));

                const urlSearchParams = new URLSearchParams(searchParams);
                urlSearchParams.set("page", page.toString());

                window.history.pushState(null, "", `?${urlSearchParams.toString()}`);
              }}
              className={page === pagination.page ? "active" : ""}>
              <span>{page}</span>
            </button>
          ))}
        </StyledPagination>
      </StyledContents>
    </StyledContainer>
  );
};

export default UserList;

const StyledContainer = styled.div``;

const StyledFilter = styled.div`
  margin-bottom: 20px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  ul {
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
  }
`;

const StyledContents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  table {
    width: 100%;
  }
`;

const StyledPagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;

  button {
    padding: 4px 6px;

    font-size: 10px;
    font-weight: 700;

    border: none;
    border-radius: 4px;

    background-color: #f0f0f0;

    span {
      color: #101010;
      opacity: 0.6;
    }

    &.active {
      background-color: #d9d9d9;

      span {
        opacity: 1;
      }
    }
  }
`;
