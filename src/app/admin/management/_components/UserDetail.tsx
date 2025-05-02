"use client";

import { User } from "@/types/user";
import Image from "next/image";
import styled from "styled-components";

import { format } from "date-fns";

interface Props {
  userId: number;
}

const MOCK_USER: User = {
  id: 1,
  name: "도지훈",
  department: {
    name: "컴퓨터학과",
    entranceYear: 22,
  },
  roles: [{ role: "Core", position: "FE", point: 0 }],
  point: {
    total: 120,
    histories: [
      {
        id: 1,
        date: "2024-12-01T15:00:00.000Z",
        name: "도지훈",
        role: "Core",
        reason: "worktree 불참",
        pointChange: -3,
      },

      {
        id: 2,
        date: "2024-12-01T15:00:00.000Z",
        name: "도지훈",
        role: "Core",
        reason: "worktree 불참",
        pointChange: -3,
      },
    ],
  },
};

const UserDetail = ({ userId }: Props) => {
  const { name, department, roles, point } = MOCK_USER;

  return (
    <StyledContainer>
      <StyledUserInfo>
        <Image src="" alt="프로필 이미지" width={60} height={60} />
        <div>
          <div className="personal-info">
            <h3>
              {name}
              <span>✏️</span>
            </h3>
            <p>
              {department.name} {department.entranceYear}학번
            </p>
          </div>
          <div className="user-info">FE - Core</div>
        </div>
      </StyledUserInfo>

      <div>
        <StyledTableHeader>
          <h5>포인트 히스토리</h5>
          <div>
            <h3>{point.total}</h3>
            <button>포인트 수정</button>
          </div>
        </StyledTableHeader>
        <StyledTableWrapper>
          <table>
            <thead>
              <tr>
                <th align="center">날짜</th>
                <th align="center">이름</th>
                <th align="center">역할</th>
                <th align="center">포인트 수정</th>
                <th align="center">사유</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {point.histories.map(({ id, date, pointChange, reason }) => (
                <tr key={id}>
                  <td align="center">{format(date, "yyyy년 MM월 dd일")}</td>
                  <td align="center">{name}</td>
                  <td align="center">{roles[0].role}</td>
                  <td align="center">{pointChange > 0 ? `+${pointChange}` : pointChange}</td>
                  <td align="center">{reason}</td>
                  <td>
                    <button>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </StyledTableWrapper>
      </div>
    </StyledContainer>
  );
};

export default UserDetail;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const StyledUserInfo = styled.div`
  display: flex;
  gap: 12px;

  > div {
    flex: 1;
    display: flex;
    justify-content: space-between;

    .personal-info {
      display: flex;
      flex-direction: column;
      gap: 2px;

      h3 {
        display: inline-flex;
        gap: 8px;

        font-size: 20px;
        font-weight: 800;
        color: #000000;
      }

      p {
        font-size: 12px;
        font-weight: 200;
        line-height: 22px;
      }
    }
  }
`;

const StyledTableHeader = styled.div`
  margin-bottom: 12px;

  display: flex;
  justify-content: space-between;
  align-items: end;

  h5 {
    font-size: 12px;
    font-weight: 700;
  }

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    h3 {
      font-size: 20px;
      font-weight: 700;
      line-height: 22px;
    }

    button {
      padding: 6px 20px;

      border-radius: 999px;

      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      background-color: #424242;
    }
  }
`;

const StyledTableWrapper = styled.div`
  padding: 20px;

  border-radius: 16px;
  background-color: #f2f2f2;

  table {
    table-layout: fixed;
    width: 100%;

    border-collapse: separate;
    border-spacing: 0 8px;

    thead {
      height: 20px;

      th {
        font-size: 8px;
        font-weight: 800;
        line-height: 22px;
        opacity: 0.5;
      }
    }

    tbody {
      tr {
        td {
          font-size: 10px;
          font-weight: 500;
          line-height: 22px;

          &:not(:last-child) {
            cursor: pointer;
          }

          button {
            margin-left: 16px;

            font-size: 10px;
            font-weight: 600;
            line-height: 15px;

            border-radius: 4px;
            background-color: #424242;
            color: #ffffff;

            opacity: 0;

            cursor: pointer;
          }
        }

        &:hover button {
          opacity: 1;
        }
      }
    }
  }
`;
