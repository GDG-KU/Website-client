'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import styles from './management.module.css';
import ModalEditUser from './ModalEditUser';
import ModalEditPoint from './ModalEditPoint';
import ModalActivitySetting from './ModalActivitySetting';

/* -----------------------------
   로컬에서 사용할 인터페이스
----------------------------- */
interface UserRole {
  role: string;
  point: number;
}
interface LogData {
  // 로컬에서 사용하는 로그 형식
  id?: number;
  date: string;
  name: string;
  role: string;
  pointChange: number;        // point_change → pointChange
  reason: string;
  accumulated_point?: number; // 선택적
}
interface Activities {
  fetch: string[];
  worktree: string[];
  branch: string[];
  solutionChallenge: string[];
}
export interface UserData {
  id: number;
  nickname: string;
  roles: UserRole[];
  profileImageUrl?: string;
  logs?: LogData[];
  activities?: Activities;
}

/* -------------------------------------
   백엔드 응답 형태(서버 전용) 인터페이스
-------------------------------------- */
interface ServerUser {
  id: number;
  nickname: string;
  roles?: {
    role: string;
    point: number;
  }[];
  profileImageUrl?: string;
}

interface ServerLogData {
  id: number;
  point_change: number;       // 백엔드가 사용하는 필드명
  role: string;
  reason: string;
  accumulated_point: number;
  date: string;
}

const activityTabs = ['fetch', 'worktree', 'branch', 'solution challenge'];

export default function ManagementPage() {
  // (1) 전체 사용자 목록
  const [users, setUsers] = useState<UserData[]>([]);

  // (2) 검색, 필터, 페이지네이션
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] =
    useState<'ALL' | 'DevRel' | 'Core' | 'Member' | 'Junior'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // (3) 선택된 사용자 상세
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('fetch');

  // (4) 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);         // 회원정보 수정 모달
  const [isPointModalOpen, setIsPointModalOpen] = useState(false); // 포인트 수정 모달
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false); // 활동관리 모달

  // (A) 전체 유저 목록 가져오기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const roleQuery = filterRole === 'ALL' ? '' : filterRole;
        const res = await fetch(`/user?page=1&role=${roleQuery}`, {
          method: 'GET',
        });
        if (!res.ok) {
          throw new Error('Failed to fetch user list');
        }
        const responseData = await res.json();
        // 예: [{ data: [...] }]
        if (Array.isArray(responseData) && responseData.length > 0) {
          const { data: userList } = responseData[0];
          // userList를 ServerUser[]로 가정
          const enrichedList: UserData[] = (userList as ServerUser[]).map((u) => ({
            id: u.id,
            nickname: u.nickname,
            roles: u.roles || [],
            profileImageUrl: u.profileImageUrl || '',
            logs: [],
            activities: {
              fetch: [],
              worktree: [],
              branch: [],
              solutionChallenge: [],
            },
          }));
          setUsers(enrichedList);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [filterRole]);

  // (B) 검색 필터
  const filteredData = useMemo(() => {
    let data = users;
    if (searchTerm.trim() !== '') {
      data = data.filter((u) =>
        u.nickname.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
    }
    return data;
  }, [users, searchTerm]);

  // (C) 페이지네이션
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // (D) 사용자 클릭 시 상세 조회
  const handleUserClick = async (user: UserData) => {
    setSelectedUser(null);
    try {
      // 예시: GET /point/{userId}
      const pointRes = await fetch(`/point/${user.id}`, { method: 'GET' });
      let userPoints: UserRole[] | null = null;
      if (pointRes.ok) {
        // 백엔드가 [{ role, point }, ...] 형태 반환
        userPoints = await pointRes.json();
      }

      // 예시: GET /point/history/{userId}
      const historyRes = await fetch(`/point/history/${user.id}`, { method: 'GET' });
      let historyData: ServerLogData[] = [];
      if (historyRes.ok) {
        historyData = await historyRes.json();
      }

      // logs 변환
      const logs = historyData.map<LogData>((item) => ({
        date: item.date,
        name: user.nickname, // 서버에 따라 다를 수 있음
        role: item.role,
        pointChange: item.point_change, // 여기서 point_change → pointChange
        reason: item.reason,
        accumulated_point: item.accumulated_point,
      }));

      const updatedUser: UserData = {
        ...user,
        roles: userPoints || user.roles, // 백엔드에서 받은 포인트 정보
        logs: logs,
      };
      setSelectedUser(updatedUser);
    } catch (error) {
      console.error('사용자 상세 조회 실패:', error);
      setSelectedUser(user); // 실패 시라도 기본 정보는 표시
    }
  };

  // (E) 회원정보 수정 모달 열기
  const handleEditIconClick = () => {
    if (!selectedUser) return;
    setIsModalOpen(true);
  };
  const handleSaveUserChanges = (updated: UserData) => {
    const updatedList = users.map((u) => (u.id === updated.id ? updated : u));
    setUsers(updatedList);
    setSelectedUser(updated);
    setIsModalOpen(false);
  };

  // (F) 포인트 수정 모달
  const handleOpenPointModal = () => {
    if (!selectedUser) return;
    setIsPointModalOpen(true);
  };
  const handleSavePointChanges = (updated: UserData) => {
    const updatedList = users.map((u) => (u.id === updated.id ? updated : u));
    setUsers(updatedList);
    setSelectedUser(updated);
    setIsPointModalOpen(false);
  };

  // (G) 활동 관리 (세팅) 모달
  const handleOpenSettingModal = () => {
    if (!selectedUser) return;
    setIsSettingModalOpen(true);
  };
  const handleSaveActivityChanges = (updatedActivities: string[]) => {
    if (!selectedUser || !selectedUser.activities) return;

    const newActivities = { ...selectedUser.activities };
    if (activeTab === 'fetch') {
      newActivities.fetch = updatedActivities;
    } else if (activeTab === 'worktree') {
      newActivities.worktree = updatedActivities;
    } else if (activeTab === 'branch') {
      newActivities.branch = updatedActivities;
    } else if (activeTab === 'solution challenge') {
      newActivities.solutionChallenge = updatedActivities;
    }

    const updatedUser: UserData = {
      ...selectedUser,
      activities: newActivities,
    };
    const updatedList = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedList);
    setSelectedUser(updatedUser);
    setIsSettingModalOpen(false);
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminContentWrapper}>
        {/* --- 왼쪽 영역 (검색 + 필터 + 테이블 + 페이지네이션) --- */}
        <div className={styles.leftSide}>
          {/* 검색창 */}
          <div className={styles.searchSection}>
            <input
              className={styles.searchInput}
              placeholder="닉네임 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 필터 버튼 */}
          <div className={styles.filterSection}>
            {['ALL', 'DevRel', 'Core', 'Member', 'Junior'].map((roleValue) => (
              <button
                key={roleValue}
                className={`${styles.filterBtn} ${
                  filterRole === roleValue ? styles.active : ''
                }`}
                onClick={() => {
                  setFilterRole(roleValue as typeof filterRole);
                  setCurrentPage(1);
                }}
              >
                {roleValue}
              </button>
            ))}
          </div>

          {/* 유저 테이블 */}
          <table className={styles.memberTable}>
            <thead>
              <tr>
                <th>닉네임</th>
                <th>역할</th>
                <th>포인트(합)</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((u) => {
                const roleString = u.roles.map((r) => r.role).join(', ');
                const totalPoints = u.roles.reduce((sum, r) => sum + r.point, 0);
                return (
                  <tr
                    key={u.id}
                    className={
                      selectedUser?.id === u.id ? styles.selectedRow : ''
                    }
                    onClick={() => handleUserClick(u)}
                  >
                    <td>{u.nickname}</td>
                    <td>{roleString}</td>
                    <td>{totalPoints}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className={styles.paginationRow}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`${styles.pageBtn} ${p === currentPage ? styles.active : ''}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* --- 오른쪽 영역 (선택된 유저 상세) --- */}
        {selectedUser && (
          <div className={styles.memberDetailSection}>
            <div className={styles.detailHeader}>
              <Image
                src={
                  selectedUser.profileImageUrl && selectedUser.profileImageUrl.trim() !== ''
                    ? selectedUser.profileImageUrl
                    : '/profile.svg'
                }
                alt="프로필 이미지"
                className={styles.manageProfileImage}
                width={60}
                height={60}
              />
              <h2>
                {selectedUser.nickname}
                <span className={styles.editIcon} onClick={handleEditIconClick}>
                  ✏️
                </span>
              </h2>
              <div className={styles.detailRole}>
                {selectedUser.roles.map((r) => r.role).join(', ')}
              </div>
              <div className={styles.detailPoint}>
                <strong>
                  {selectedUser.roles.reduce((sum, r) => sum + r.point, 0)}
                </strong>{' '}
                P
                <button className={styles.pointEditBtn} onClick={handleOpenPointModal}>
                  포인트 수정
                </button>
              </div>
            </div>

            {/* 점수 수정 히스토리 */}
            <div className={styles.scoreHistory}>
              <h3>점수 수정 히스토리</h3>
              <div className={styles.scoreHistoryTable}>
                <table>
                  <thead>
                    <tr>
                      <th>날짜</th>
                      <th>이름</th>
                      <th>역할</th>
                      <th>포인트 수정</th>
                      <th>사유</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUser.logs && selectedUser.logs.length > 0 ? (
                      selectedUser.logs.map((log, idx) => (
                        <tr key={idx}>
                          <td>{log.date}</td>
                          <td>{log.name}</td>
                          <td>{log.role}</td>
                          <td>
                            {log.pointChange > 0 ? `+${log.pointChange}` : log.pointChange}
                          </td>
                          <td>{log.reason}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center' }}>
                          기록이 없습니다
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 활동 관리 */}
            <div className={styles.activityManage}>
              <h3>활동 관리</h3>
              <div className={styles.tabs}>
                {activityTabs.map((tab) => (
                  <button
                    key={tab}
                    className={`${styles.tabBtn} ${activeTab === tab ? styles.active : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
                {/* 설정 아이콘 */}
                <button className={styles.tabSettingBtn} onClick={handleOpenSettingModal}>
                  <Image src="/settingicon.svg" alt="설정" width={24} height={24} />
                </button>
              </div>
              <div className={styles.tabContent}>
                {activeTab === 'fetch' && (
                  <div className={styles.activityPanel}>
                    {selectedUser.activities?.fetch?.map((item, idx) => (
                      <p key={idx}>{item}</p>
                    ))}
                  </div>
                )}
                {activeTab === 'worktree' && (
                  <div className={styles.activityPanel}>
                    {selectedUser.activities?.worktree?.map((item, idx) => (
                      <p key={idx}>{item}</p>
                    ))}
                  </div>
                )}
                {activeTab === 'branch' && (
                  <div className={styles.activityPanel}>
                    {selectedUser.activities?.branch?.map((item, idx) => (
                      <p key={idx}>{item}</p>
                    ))}
                  </div>
                )}
                {activeTab === 'solution challenge' && (
                  <div className={styles.activityPanel}>
                    {selectedUser.activities?.solutionChallenge?.map((item, idx) => (
                      <p key={idx}>{item}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* (A) 회원정보 수정 모달 */}
      {selectedUser && (
        <ModalEditUser
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
          onSave={handleSaveUserChanges}
        />
      )}
      {/* (B) 포인트 수정 모달 */}
      {selectedUser && (
        <ModalEditPoint
          isOpen={isPointModalOpen}
          onClose={() => setIsPointModalOpen(false)}
          user={selectedUser}
          onSave={handleSavePointChanges}
        />
      )}
      {/* (C) 활동 관리 (세팅) 모달 */}
      {selectedUser && (
        <ModalActivitySetting
          isOpen={isSettingModalOpen}
          onClose={() => setIsSettingModalOpen(false)}
          activeTab={activeTab}
          user={selectedUser}
          onSave={handleSaveActivityChanges}
        />
      )}
    </div>
  );
}
