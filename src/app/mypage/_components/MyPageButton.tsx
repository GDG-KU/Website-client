"use client";

import Link from "next/link";
import styled from "styled-components";

interface Props {
  buttonText: string;
  onClick?: () => void;
  isBlue?: boolean;
  href?: string;
  isRed?: boolean;
}

interface ButtonStyleProps {
  isBlue?: boolean;
  isRed?: boolean;
}

const MyPageButton = (props: Props) => {
  const { buttonText, onClick, isBlue, href, isRed } = props;
  return (
    <>
      {href ? (
        <Link href={href}>
          <StyledButton isBlue={isBlue}>{buttonText}</StyledButton>
        </Link>
      ) : (
        <>
          <StyledButton onClick={onClick} isBlue={isBlue} isRed={isRed}>
            {buttonText}
          </StyledButton>
        </>
      )}
    </>
  );
};

export default MyPageButton;

const StyledButton = styled.button<ButtonStyleProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 110px;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  border: none;
  background-color: ${(props) => (props.isBlue ? "#4385f5" : props.isRed ? "#f44336" : "#424242")};
  color: #fff;

  text-align: center;
  font-size: 0.95rem;

  &:hover {
    cursor: pointer;
    background-color: ${(props) => (props.isBlue ? "#2f68ca" : props.isRed ? "#d32f2f" : "#1A1A1A")};
    transition: background-color 0.2s;
  }
`;
