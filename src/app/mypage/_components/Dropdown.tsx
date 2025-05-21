import { useState } from "react";
import { ClickAwayListener } from "@mui/material";
import Image from "next/image";
import styled from "styled-components";

interface Props {
  placeholder?: string;
  value: string;
  data: any[];
  name?: any;
  field: any;
  disabled: boolean;
}

interface ContainerProps {
  disabled: boolean;
  optionOpen: boolean;
}

interface OptionProps {
  //   isLast: boolean;
  selectedItem: boolean;
}

const Dropdown = (props: Props) => {
  const { placeholder, value, data, name, field, disabled } = props;
  const [optionOpen, setOptionOpen] = useState(false);

  const handleItemClick = () => {
    setOptionOpen((state) => !state);
  };

  return (
    <>
      <ClickAwayListener onClickAway={() => setOptionOpen(false)}>
        <DropdownContainer
          disabled={disabled}
          optionOpen={optionOpen}
          onClick={() => {
            if (disabled) return;
            setOptionOpen((state) => !state);
          }}>
          <h5>
            {value && name && data.findIndex((o) => o[field] === value[field]) >= 0
              ? data[data.findIndex((o) => o[field] === value[field])][name]
              : !name && value
                ? value
                : placeholder}
          </h5>
          <Image src={"/arrow-down.svg"} alt={"Arrow-down icon"} width={24} height={24} />
          {optionOpen && (
            <OptionContainer>
              {/* {data.map((item, key) => {
                let selectedItem = false;
                if (value && value.length > 0) {
                  if (value.indexOf(item) !== -1) selectedItem = true;
                }
                if (value && value[name] === item[name]) selectedItem = true;
                return (
                  <Option
                    key={key}
                    {...props}
                    onClick={() => {
                      handleItemClick();
                      setOptionOpen((state) => !state);
                    }}
                    selectedItem={selectedItem}
                    >
                    <h5>{item}</h5>
                  </Option>
                );
              })} */}
            </OptionContainer>
          )}
        </DropdownContainer>
      </ClickAwayListener>
    </>
  );
};

export default Dropdown;

const DropdownContainer = styled.div<ContainerProps>`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;

  min-width: 280px;
  padding: 8px 16px;

  border: 1px solid #101010;
  border-radius: 8px;
  background-color: #fff;

  h5 {
    font-size: 12px;
  }

  &:hover {
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};
    opacity: ${(props) => (props.disabled ? 1 : 0.6)};
  }
`;

const OptionContainer = styled.div`
  position: absolute;
  top: 105%;
  left: 0;

  background-color: #fff;
  filter: drop-shadow(8px 16px 24px rgba(69, 79, 89, 0.04));
  border-radius: 0px 0px 6px 6px;

  width: 100%;
  max-height: 230px;

  overflow-y: scroll;
  overflow-x: hidden;
`;

const Option = styled.div<OptionProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px;
  background-color: ${(props) => (props.selectedItem ? "#E1E2E4" : "#fff")};

  img {
    opacity: 0;
    z-index: 95;
    padding-right: 12px;
  }

  p {
    padding: 10px 12px;
  }

  &:hover {
    background: ${"#E1E2E4"};
    border-radius: 5px;

    img {
      opacity: 1;
    }
  }
`;
