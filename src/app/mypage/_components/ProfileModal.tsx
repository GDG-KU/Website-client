import { useState } from "react";
import styled from "styled-components";

import MyPageButton from "./MyPageButton";

interface ProfileProps {
  name: string;
  dept: string;
  studentNum: string;
  positionNames: string;
}

interface Props {
  profileData: ProfileProps;
  onChange: (e: string, name: string) => void;
  onSaveProfile: () => void;
  onDeleteImage: () => void;
  onCloseModal: () => void;
}

const ProfileModal = (props: Props) => {
  const { onChange, profileData, onSaveProfile, onDeleteImage, onCloseModal } = props;
  const { name, dept, studentNum, positionNames } = profileData;
  return (
    <>
      <OverlayContainer>
        <ModalContainer>
          <h2>프로필 정보 수정</h2>
          <ModalContent>
            <label>닉네임</label>
            <input type="text" value={name} onChange={(e) => onChange(e.target.value, "name")} />
            <label>학과</label>
            <input type="text" value={dept} onChange={(e) => onChange(e.target.value, "dept")} />
            <label>학번</label>
            <input type="text" value={studentNum} onChange={(e) => onChange(e.target.value, "studentNum")} />
            <label>Position</label>
            <input type="text" value={positionNames} onChange={(e) => onChange(e.target.value, "positionNames")} />
          </ModalContent>
          <ModalActions>
            <MyPageButton buttonText="프로필 이미지 삭제" isRed onClick={onDeleteImage} />
            <MyPageButton buttonText="저장" isBlue onClick={onSaveProfile} />
            <MyPageButton buttonText="취소" onClick={onCloseModal} />
          </ModalActions>
        </ModalContainer>
      </OverlayContainer>
    </>
  );
};

export default ProfileModal;

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;

  h2 {
    margin-top: 0;
    font-size: 20px;
    color: #333;
    text-align: center;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;

  label {
    font-size: 12px;
    color: #555;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 12px;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;
