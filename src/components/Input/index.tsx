"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components";

// eslint-disable-next-line
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, Props>(({ ...inputProps }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>();

  const { className, style, onChange, ...restProps } = inputProps;

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  return (
    <StyledContainer className={className} style={style}>
      <StyledInput
        ref={inputRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (onChange) onChange(e);
        }}
        {...restProps}
      />
      {value && (
        <button
          className="input-clear"
          onClick={(e) => {
            e.preventDefault();

            setValue("");
            if (onChange) {
              const dummyEvent = { target: { value: "" } } as unknown as React.ChangeEvent<HTMLInputElement>;
              onChange(dummyEvent);
            }

            inputRef.current?.focus();
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
