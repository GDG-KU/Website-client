"use client";

import Modal from "@/components/Modal";
import styled from "styled-components";
import ModalDeleteUser from "./ModalDeleteUser";
import { useState } from "react";
import ModalAddUser from "./ModalAddUser";

const ActivityDetail = () => {
  const [modalState, setModalState] = useState<false | { type: "DELETE" } | { type: "ADD" }>(false);

  return (
    <StyledContainer>
      <h2>
        Design System
        <span onClick={() => setModalState({ type: "ADD" })}>+</span>
      </h2>
      <div className="table-wrapper">
        <StyledTable>
          <colgroup>
            <col />
            <col />
            <col />
            <col />
            <col width="60" />
          </colgroup>
          <thead>
            <tr>
              <td>이름</td>
              <td>레벨</td>
              <td>포지션</td>
              <td>롤</td>
              <td>&nbsp;</td>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 50 }, (_, i) => i + 1).map((i) => (
              <tr key={i}>
                <td>변서연{i}</td>
                <td>Organizer</td>
                <td>Organizer</td>
                <td>PM</td>
                <td className="btn">
                  <button
                    onClick={() =>
                      setModalState({
                        type: "DELETE",
                      })
                    }>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </div>
      <Modal
        isOpen={!!modalState}
        onClose={() => {
          setModalState(false);
        }}>
        {modalState && (
          <>
            {modalState.type === "DELETE" && <ModalDeleteUser />}
            {modalState.type === "ADD" && <ModalAddUser />}
          </>
        )}
      </Modal>
    </StyledContainer>
  );
};

export default ActivityDetail;

const StyledContainer = styled.div`
  padding: 1rem;

  display: flex;
  flex-direction: column;
  gap: 20px;

  background-color: #f2f2f2;
  border-radius: 16px;

  > h2 {
    display: flex;
    justify-content: space-between;

    font-size: 20px;
    font-weight: 700;
  }

  .table-wrapper {
    flex: 1;
    overflow-y: auto;
  }
`;

const StyledTable = styled.table`
  width: 100%;

  td {
    font-size: 8px;
    line-height: 22px;

    &:not(:last-child) {
      text-align: center;
    }
  }

  thead td {
    font-weight: 800;
    color: rgba(0, 0, 0, 0.5);
  }

  tbody > tr {
    > .btn {
      padding-inline: 4px;
      opacity: 0;

      > button {
        padding: 4px 12px;
        border-radius: 9999px;

        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background-color: #424242;
      }
    }

    &:hover {
      cursor: pointer;

      > td:not(.btn) {
        background-color: rgba(217, 217, 217, 0.5);

        &:first-child {
          border-radius: 4px 0 0 4px;
        }

        &:nth-last-child(2) {
          border-radius: 0 4px 4px 0;
        }
      }

      > .btn {
        opacity: 1;
      }
    }
  }

  tbody td {
    font-weight: 500;
    width: 76px;
  }
`;
