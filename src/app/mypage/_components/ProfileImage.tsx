"use client";

import { ChangeEvent } from "react";
import Image from "next/image";
import styled from "styled-components";

interface Props {
  profileImageUrl: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ProfileImage = (props: Props) => {
  const { profileImageUrl, onChange } = props;

  return (
    <>
      <ProfileImageContainer>
        <Image src={profileImageUrl} alt="프로필 사진" width={145} height={145} />
        <EditProfileButton htmlFor="profileUpload">
          <Image src={"/profile-edit.svg"} alt="프로필 사진 변경" width={20} height={25} />
        </EditProfileButton>
        <input
          id="profileUpload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => onChange(e)}
        />
      </ProfileImageContainer>
    </>
  );
};

export default ProfileImage;

const ProfileImageContainer = styled.div`
  position: relative;
`;

const EditProfileButton = styled.label`
  min-width: 40px;
  min-height: 40px;
  border-radius: 50%;

  position: absolute;
  bottom: 0;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #424242;
  border: 3px solid #fbfbfb;

  &:hover {
    background-color: #6b6b6b;
    transition: background-color 0.2s;
    cursor: pointer;
  }
`;
