"use client";

import Table from "@/components/Table";
import styled from "styled-components";

export default function FAQManagementPage() {
  return (
    <StyledContainer>
      <Table
        columns={[
          { title: "제목", render: ({ title }) => title, width: 200 },
          { title: "내용", render: ({ content }) => <StyledContent>{content}</StyledContent>, width: "80%" },
        ]}
        data={[
          {
            title: "승급은 어덯게 할 수 있나요?",
            content:
              "바쁜 하루 속에서 잠시 멈춰 커피 한 잔을 마시는 순간은 소중하다. 따뜻한 커피 향이 퍼지면 마음도 차분해지고 어쩌고 저쩌고 아 몰라 일립시스 시켜줘어",
          },
        ]}
      />
    </StyledContainer>
  );
}

const StyledContent = styled.p`
  font-size: 10px;
  font-weight: 500;
`;

const StyledContainer = styled.div`
  padding: 60px;
`;
