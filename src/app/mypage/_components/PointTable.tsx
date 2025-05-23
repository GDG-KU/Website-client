import styled from "styled-components";

interface PointHistoryItem {
  date: string;
  change: number;
  total: number;
  reason: string;
}

interface Props {
  pointHistory: PointHistoryItem[];
}

const MOCK_DATA = [
  {
    id: 1,
    point_change: 100,
    role: "Devrel",
    reason: "워크트리 참여",
    accumulated_point: 10,
    date: "2025-01-01",
    is_deleted: false,
    reason_date: "2025-01-01",
  },
  {
    id: 2,
    point_change: 100,
    role: "Devrel",
    reason: "워크트리 참여",
    accumulated_point: 10,
    date: "2025-01-01",
    is_deleted: false,
    reason_date: "2025-01-01",
  },
  {
    id: 3,
    point_change: 100,
    role: "Devrel",
    reason: "워크트리 참여",
    accumulated_point: 10,
    date: "2025-01-01",
    is_deleted: false,
    reason_date: "2025-01-01",
  },
  {
    id: 4,
    point_change: 100,
    role: "Devrel",
    reason: "워크트리 참여",
    accumulated_point: 10,
    date: "2025-01-01",
    is_deleted: false,
    reason_date: "2025-01-01",
  },
  {
    id: 1,
    point_change: 100,
    role: "Devrel",
    reason: "워크트리 참여",
    accumulated_point: 10,
    date: "2025-01-01",
    is_deleted: false,
    reason_date: "2025-01-01",
  },
  {
    id: 2,
    point_change: 100,
    role: "Devrel",
    reason: "워크트리 참여",
    accumulated_point: 10,
    date: "2025-01-01",
    is_deleted: false,
    reason_date: "2025-01-01",
  },
  {
    id: 3,
    point_change: 100,
    role: "Devrel",
    reason: "워크트리 참여",
    accumulated_point: 10,
    date: "2025-01-01",
    is_deleted: false,
    reason_date: "2025-01-01",
  },
  {
    id: 4,
    point_change: 100,
    role: "Devrel",
    reason: "워크트리 참여",
    accumulated_point: 10,
    date: "2025-01-01",
    is_deleted: false,
    reason_date: "2025-01-01",
  },
  {
    id: 1,
    point_change: 100,
    role: "Devrel",
    reason: "워크트리 참여",
    accumulated_point: 10,
    date: "2025-01-01",
    is_deleted: false,
    reason_date: "2025-01-01",
  },
  {
    id: 2,
    point_change: 100,
    role: "Devrel",
    reason: "워크트리 참여",
    accumulated_point: 10,
    date: "2025-01-01",
    is_deleted: false,
    reason_date: "2025-01-01",
  },
  {
    id: 3,
    point_change: 100,
    role: "Devrel",
    reason: "워크트리 참여",
    accumulated_point: 10,
    date: "2025-01-01",
    is_deleted: false,
    reason_date: "2025-01-01",
  },
  {
    id: 4,
    point_change: 100,
    role: "Devrel",
    reason: "워크트리 참여",
    accumulated_point: 10,
    date: "2025-01-01",
    is_deleted: false,
    reason_date: "2025-01-01",
  },
];

const PointTable = (props: Props) => {
  const { pointHistory } = props;
  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            <th>활동 날짜</th>
            <th>포인트 수정</th>
            <th>누적 포인트</th>
            <th>사유</th>
          </tr>
        </thead>
        <tbody>
          {pointHistory.map((item, idx) => {
            return (
              <tr key={idx}>
                <td>{item.date}</td>
                <td>{item.change}</td>
                <td>{item.total}</td>
                <td>{item.reason}</td>
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default PointTable;

const TableContainer = styled.div`
  background-color: #fff;
  border-radius: 16px;
  width: 100%;
  max-height: 500px;
  overflow-y: scroll;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead th {
    position: sticky;
    top: 0;
    background-color: #fff;
  }

  th,
  td {
    padding: 16px;
    color: #333;
  }

  th {
    font-size: 10px;
    font-weight: 600;
    color: #666;
    text-align: center;
  }

  td {
    font-weight: 600;
    color: #000;
    text-align: center;
    font-size: 11px;
  }
`;
