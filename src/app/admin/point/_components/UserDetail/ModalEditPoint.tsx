import Input from "@/components/Input";
import styled from "styled-components";

export interface ModalEditPointProps {
  userId: number;
}

const ModalEditPoint = ({ userId }: ModalEditPointProps) => {
  return (
    <StyledContainer>
      <div>
        <StyledMajorCategoryList>
          <li>
            <button className="active">전체</button>
          </li>
          <li>
            <button>워크트리 관련 내규</button>
          </li>
        </StyledMajorCategoryList>
      </div>
      <div>
        <StyledMinorCategoryList>
          {Array.from({ length: 50 }, (_, i) => i + 1).map((x) => (
            <li key={x}>
              <button className="active">
                <span>워크트리 불참</span>
                <span>-20</span>
              </button>
            </li>
          ))}
        </StyledMinorCategoryList>
      </div>
      <div>
        <StyledFormBlock>
          <StyledPointInfo>
            <h4>현재 포인트</h4>
            <h3>120P</h3>
          </StyledPointInfo>
          <StyledForm>
            <div>
              <StyledFormInput>
                <label>사유</label>
                <Input />
              </StyledFormInput>

              <StyledFormInput>
                <label>포인트 수정</label>
                <Input />
              </StyledFormInput>

              <StyledFormInput>
                <label>연도/월</label>
                <Input />
              </StyledFormInput>

              <div>
                <StyledSwitch>
                  <ul>
                    <li className="active">날짜 선택</li>
                    <li>주차 선택</li>
                  </ul>
                </StyledSwitch>
                <StyledFormInput>
                  <label>날짜</label>
                  <Input />
                </StyledFormInput>
              </div>
            </div>
            <button>저장하기</button>
          </StyledForm>
        </StyledFormBlock>
      </div>
    </StyledContainer>
  );
};

export default ModalEditPoint;

const StyledContainer = styled.div`
  width: 660px;
  height: 500px;

  display: grid;
  grid-template-columns: 140px 220px 1fr;

  > div {
    padding: 30px 20px;

    overflow: hidden;

    &:not(:first-child) {
      border-left: 2px solid #ebebeb;
    }
  }
`;

const StyledMajorCategoryList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;

  height: 100%;
  overflow-y: auto;

  > li > button {
    display: inline-block;

    width: 100%;
    height: 30px;

    font-size: 10px;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.5);
    line-height: 22px;

    background: transparent;

    border: none;
    border-radius: 4px;

    cursor: pointer;

    &.active {
      background-color: #424242;
      color: #ffffff;
    }
  }
`;

const StyledMinorCategoryList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;

  height: 100%;
  overflow-y: auto;

  > li > button {
    padding: 0 12px;

    display: inline-flex;
    justify-content: space-between;
    align-items: center;

    border: none;
    border-radius: 4px;

    width: 100%;
    height: 30px;

    background-color: rgba(217, 217, 217, 0.5);
    opacity: 0.4;

    cursor: pointer;

    &.active {
      opacity: 1;
    }

    > span {
      font-size: 10px;
      font-weight: 800;
      color: rgba(0, 0, 0);
      opacity: 0.5;

      line-height: 22px;
    }
  }
`;

const StyledPointInfo = styled.div`
  margin-bottom: 16px;

  > h4 {
    margin-bottom: 8px;

    font-size: 12px;
    font-weight: 800;
    line-height: 22px;
    opacity: 0.5;

    text-align: center;
  }

  > h3 {
    font-size: 32px;
    font-weight: 700;
    line-height: 22px;

    text-align: center;
  }
`;

const StyledFormBlock = styled.div`
  display: flex;
  flex-direction: column;

  height: 100%;
`;

const StyledForm = styled.form`
  position: relative;
  flex: 1;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 8px;
  }

  > button {
    position: absolute;
    right: 0;
    bottom: 0;

    padding: 6px 20px;

    font-size: 14px;
    font-weight: 600;
    line-height: 21.2px;

    background-color: #424242;
    color: #ffffff;

    border-radius: 9999px;

    cursor: pointer;
  }
`;

const StyledFormInput = styled.div`
  > label {
    display: block;

    font-size: 12px;
    font-weight: 500;
    line-height: 22px;
  }
`;

const StyledSwitch = styled.div`
  margin-top: 24px;
  margin-bottom: 8px;
  display: flex;
  justify-content: center;

  > ul {
    padding: 4px;

    display: flex;
    gap: 2px;

    background-color: #aaaaaa;
    border-radius: 8px;

    > li {
      padding: 6px 16px;

      font-size: 8px;
      font-weight: 500;
      color: #ffffff;

      border-radius: 6px;

      cursor: pointer;

      &.active {
        color: #424242;
        background-color: #ffffff;
      }
    }
  }
`;
