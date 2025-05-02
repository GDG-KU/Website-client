"use client";

import { forwardRef, useState } from "react";
import styled from "styled-components";

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (value: string) => void;
}

// TODO: X 아이콘 추가
const Input = forwardRef<HTMLInputElement, Props>(({ ...inputProps }, ref) => {
  const [inputText, setInputText] = useState<string>();

  const { className, style, value, onChange, ...restProps } = inputProps;

  const handleInputChange = (text: string) => {
    if (onChange) onChange(text);
    else setInputText(text);
  };

  return (
    <StyledContainer className={className} style={style}>
      <StyledInput
        ref={ref}
        value={value || inputText}
        onChange={(e) => {
          const text = e.target.value;
          handleInputChange(text);
        }}
        {...restProps}
      />
      {(value || inputText) && (
        <button
          className="input-clear"
          onClick={(e) => {
            e.preventDefault();
            handleInputChange("");
          }}>
          x
        </button>
      )}
    </StyledContainer>
  );
});

Input.displayName = "Input";

export default Input;

const StyledContainer = styled.span`
  display: inline-flex;
  align-items: center;

  padding-inline: 16px;
  height: 32px;

  border: 1px solid #dddddd;
  border-radius: 8px;

  &:focus {
    border: 1px solid rgba(0, 0, 0, 0.4);
  }

  input {
    flex: 1;
  }

  .input-clear {
  }
`;

const StyledInput = styled.input`
  border: none;
  outline: none;

  color: rgba(0, 0, 0, 0.75);

  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
`;
