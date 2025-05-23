"use client";

import styled from "styled-components";

const ModalDeleteUser = () => {
  return (
    <StyledContainer>
      <StyledText>
        <h2>활동 삭제</h2>
        <p>선택한 멤버를 활동으로부터 삭제하시겠습니까?</p>
      </StyledText>
      <button>삭제</button>
    </StyledContainer>
  );
};

export default ModalDeleteUser;

const StyledContainer = styled.div`
  padding: 48px 72px;

  display: flex;
  flex-direction: column;
  align-items: center;

  > button {
    padding: 6px 32px;

    font-size: 14px;
    font-weight: 600;
    line-height: 21px;
    color: #ffffff;

    background-color: #424242;

    border-radius: 9999px;
  }
`;

const StyledText = styled.div`
  margin-bottom: 36px;

  > h2 {
    margin-bottom: 20px;

    font-size: 24px;
    font-weight: 600;

    text-align: center;
  }

  > p {
    font-size: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.56);
  }
`;
