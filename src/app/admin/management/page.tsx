"use client";

import styled from "styled-components";
import { useState } from "react";
import UserDetail from "./_components/UserDetail";
import UserList from "./_components/UserList";

interface UserRole {
  role: string;
  point: number;
}

interface LogData {
  id?: number;
  date: string;
  name: string;
  role: string;
  pointChange: number;
  reason: string;
  accumulated_point?: number;
}
export interface UserData {
  id: number;
  nickname: string;
  roles: UserRole[];
  profileImageUrl?: string;
  logs?: LogData[];
}

export default function ManagementPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(1);

  // const handleUserClick = async (user: UserData) => {
  //   setSelectedUser(null);
  //
  //   try {
  //     const pointUrl = `${API_BASE_URL}/point/${user.id}`;
  //     const pointRes = await fetchWithAuth(pointUrl, { method: "GET" });
  //     let userPoints: UserRole[] | null = null;
  //     if (pointRes.ok) {
  //       userPoints = await pointRes.json();
  //     }
  //     const historyUrl = `${API_BASE_URL}/point/history/${user.id}`;
  //     const historyRes = await fetchWithAuth(historyUrl, { method: "GET" });
  //     let historyData: ServerLogData[] = [];
  //     if (historyRes.ok) {
  //       historyData = await historyRes.json();
  //     }
  //     const logs = historyData.map<LogData>((item) => ({
  //       date: item.date,
  //       name: user.nickname,
  //       role: item.role,
  //       pointChange: item.point_change,
  //       reason: item.reason,
  //       accumulated_point: item.accumulated_point,
  //     }));
  //     const updatedUser: UserData = {
  //       ...user,
  //       roles: userPoints || user.roles,
  //       logs: logs,
  //     };
  //     setSelectedUser(updatedUser);
  //   } catch (error) {
  //     console.error("User detail fetch failed:", error);
  //     setSelectedUser(user);
  //   }
  // };
  //
  // const handleSaveUserChanges = (updated: UserData) => {
  //   const updatedList = users.map((u) => (u.id === updated.id ? updated : u));
  //   setUsers(updatedList);
  //   setSelectedUser(updated);
  //   setIsModalOpen(false);
  // };
  //
  // const handleSavePointChanges = (updated: UserData) => {
  //   const updatedList = users.map((u) => (u.id === updated.id ? updated : u));
  //   setUsers(updatedList);
  //   setSelectedUser(updated);
  //   setIsPointModalOpen(false);
  // };

  return (
    <StyledContainer>
      <StyledContents>
        <div>
          <UserList selectedUserId={selectedUserId} handleSelectedUserId={(userId) => setSelectedUserId(userId)} />
        </div>
        <div>{selectedUserId && <UserDetail userId={selectedUserId} />}</div>
      </StyledContents>
      {/**/}
      {/* {selectedUserId && ( */}
      {/*   <ModalEditUser */}
      {/*     isOpen={isModalOpen} */}
      {/*     onClose={() => setIsModalOpen(false)} */}
      {/*     user={selectedUser!} */}
      {/*     onSave={handleSaveUserChanges} */}
      {/*   /> */}
      {/* )} */}
      {/* {selectedUserId && ( */}
      {/*   <ModalEditPoint */}
      {/*     isOpen={isPointModalOpen} */}
      {/*     onClose={() => setIsPointModalOpen(false)} */}
      {/*     user={selectedUser!} */}
      {/*     onSave={handleSavePointChanges} */}
      {/*   /> */}
      {/* )} */}
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  padding: 2rem;

  display: flex;
  flex-direction: column;
`;

const StyledContents = styled.div`
  display: flex;
  gap: 2rem;

  > div {
    width: 100%;
  }
`;
