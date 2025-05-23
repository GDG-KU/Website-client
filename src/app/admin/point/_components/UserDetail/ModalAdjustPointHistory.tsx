import { useMutation } from "@tanstack/react-query";
import styled from "styled-components";

const ADJUSTMENT = { DELETE: "삭제", RESTORE: "복구" } as const;

type Adjustment = keyof typeof ADJUSTMENT;

export interface ModalAdjustPointHistoryProps {
  type: Adjustment;
}

const ModalAdjustPointHistory = ({ type }: ModalAdjustPointHistoryProps) => {
  const adjustmentText = ADJUSTMENT[type];

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      console.log("mutate");
    },
  });

  return (
    <StyledContainer>
      <div>
        <h2>포인트 히스토리 {adjustmentText}</h2>
        <p>선택한 포인트 히스토리를 {adjustmentText}하시겠습니까?</p>
      </div>
      <button
        onClick={async () => {
          await mutateAsync();
        }}>
        {adjustmentText}
      </button>
    </StyledContainer>
  );
};

export default ModalAdjustPointHistory;

const StyledContainer = styled.div`
  padding-top: 16px;

  width: 440px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  > div {
    > h2 {
      margin-bottom: 20px;

      font-size: 24px;
      font-weight: 600;
      text-align: center;
    }

    > p {
      font-size: 16px;
      font-weight: 500;

      opacity: 0.56;
    }
  }

  > button {
    padding: 6px 32px;

    border-radius: 9999px;

    font-size: 14px;
    font-weight: 600;
    line-height: 21px;
    color: white;

    background-color: #424242;

    cursor: pointer;
  }
`;
