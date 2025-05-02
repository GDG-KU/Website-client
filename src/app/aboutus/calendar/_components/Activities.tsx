import styled from "styled-components";

const ACTIVITY_LIST = [
  {
    title: "fetch",
    category: "BE",
  },
  {
    title: "branch",
    category: "BE",
  },
  {
    title: "worktree",
    category: "Design System",
  },
  {
    title: "worktree",
    category: "Website",
  },
  {
    title: "Solution Challenge",
    category: "GDG KU",
  },
];

const Activities = () => {
  return (
    <StyledContainer>
      <h4>My Activities</h4>
      <StyledActivityList>
        {ACTIVITY_LIST.map(({ title, category }) => (
          <StyledActivityItem key={title}>{title}</StyledActivityItem>
        ))}
      </StyledActivityList>
    </StyledContainer>
  );
};

export default Activities;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  h4 {
    font-size: 15px;
    font-weight: 400;
  }
`;

const StyledActivityList = styled.ul`
  display: flex;
  gap: 1rem;
`;

const StyledActivityItem = styled.li`
  width: 200px;
  height: 100px;
`;
