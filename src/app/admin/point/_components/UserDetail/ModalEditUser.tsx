"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@/components/Input";
import styled from "styled-components";

type FormValues = {
  nickname: string;
  department: string;
  position: string;
  level: string;
};

const ModalEditUser = () => {
  const { register } = useForm<FormValues>();

  return (
    <StyledContainer>
      <StyledProfileInfo>
        <div>
          <img src="" alt="" />
        </div>
        <p>gdgku2025@gmail.com</p>
      </StyledProfileInfo>
      <StyledForm>
        <div>
          <StyledInputForm>
            <label>이름</label>
            <Input placeholder="도지훈" />
          </StyledInputForm>

          <StyledInputForm>
            <label>학과,학부</label>
            <Input placeholder="컴퓨터학과" />
          </StyledInputForm>

          <StyledInputForm>
            <label>포지션</label>
            <Input placeholder="FE" {...register("position")} />
          </StyledInputForm>
          <StyledInputForm>
            <label>레벨</label>
            <Input placeholder="CORE" {...register("level")} />
          </StyledInputForm>
        </div>
        <button>저장</button>
      </StyledForm>
    </StyledContainer>
  );
};

export default ModalEditUser;

const StyledContainer = styled.div`
  width: 660px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const StyledProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  > div {
    width: 100px;
    height: 100px;

    border-radius: 50%;
    background-color: black;

    img {
      object-fit: fill;
    }
  }

  > p {
    font-size: 12px;
    line-height: 22px;

    opacity: 0.5;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  > button {
    padding: 6px 32px;

    border-radius: 9999px;

    color: #ffffff;
    background-color: #424242;
  }
`;

const StyledInputForm = styled.div`
  > label {
    display: block;
    margin-bottom: 4px;

    font-size: 12px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 18px;
  }
`;
