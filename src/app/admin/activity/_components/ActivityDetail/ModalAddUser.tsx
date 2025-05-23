"use client";
import Input from "@/components/Input";
import Tab from "@/components/Tab";
import Table from "@/components/Table";
import { Pagination } from "@/types/pagination";
import { useState } from "react";
import styled from "styled-components";

const ModalAddUser = () => {
  const [filter, setFilter] = useState({
    search: "",
    role: "ALL",
  });
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 10 });

  return (
    <StyledContainer>
      <div style={{ width: 372 }}>
        <StyledFilter>
          <Input placeholder="검색하기" style={{ width: 240 }} />
          <Tab
            items={[
              { label: "ALL", value: "ALL" },
              { label: "DevRel", value: "DevRel" },
              { label: "Core", value: "Core" },
              { label: "Member", value: "Member" },
              { label: "Junior", value: "Junior" },
            ]}
            value={filter.role}
            onChange={(value) => {
              setFilter((prev) => ({ ...prev, role: value }));
            }}
          />
        </StyledFilter>
        <Table
          columns={[
            {
              title: "이름",
              render: ({ name }) => name,
              align: "center",
            },
            {
              title: "레벨",
              render: ({ level }) => level,
              align: "center",
            },
            {
              title: "포지션",
              render: ({ position }) => position,
              align: "center",
            },
            {
              title: "포인트",
              render: ({ point }) => point,
              align: "center",
            },
          ]}
          data={[{ name: "변서연", level: "Organizer", position: "AI", point: 100 }]}
          pagination={{
            page: pagination.page,
            total: 50,
            onChange: (page, pageSize) => setPagination({ page, pageSize }),
          }}
        />
      </div>
      <div className="divider" />
      <StyledRight>
        <div>
          <div className="form-item">
            <label>Role</label>
            <Input />
          </div>
        </div>
        <button>저장하기</button>
      </StyledRight>
    </StyledContainer>
  );
};

export default ModalAddUser;

const StyledContainer = styled.div`
  padding: 1rem 2rem;

  display: flex;
  gap: 2rem;

  height: 448px;

  > div.divider {
    width: 2px;
    height: 100%;

    background-color: #ebebeb;
  }
`;

const StyledFilter = styled.div`
  margin-bottom: 1rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;

  > div {
    flex: 1;

    display: flex;
    justify-content: center;
    align-items: center;

    .form-item {
      > label {
        display: block;

        font-size: 12px;
        font-weight: 500;
        line-height: 22px;
      }
    }
  }

  > button {
    width: fit-content;

    padding: 6px 20px;

    font-size: 14px;
    font-weight: 600;
    line-height: 21.2px;

    color: #ffffff;
    background-color: #424242;
    border-radius: 9999px;
  }
`;
