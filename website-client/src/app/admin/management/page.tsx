'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import ModalEditUser from './ModalEditUser';
import ModalEditPoint from './ModalEditPoint';
import ModalActivitySetting from './ModalActivitySetting';
import './management.css';

export interface UserRole {
  role: string; 
  point: number;
}
export interface LogData {
  date: string;
  name: string;
  role: string;
  pointChange: number;
  reason: string;
}
export interface Activities {
  fetch: string[];
  worktree: string[];
  branch: string[];
  solutionChallenge: string[];
}

export interface UserData {
  id: number;
  nickname: string;
  roles: UserRole[];
  authorities?: string[];
  logs?: LogData[];
  profileImageUrl?: string;
  activities?: Activities;
}

const activityTabs = ['fetch', 'worktree', 'branch', 'solution challenge'];

export default function ManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] =
    useState<'ALL' | 'DevRel' | 'Core' | 'Member' | 'Junior'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('fetch');
  const [isModalOpen, setIsModalOpen] = useState(false);       // 회원정보 수정
  const [isPointModalOpen, setIsPointModalOpen] = useState(false); // 포인트 수정
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false); // 활동관리 세팅

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const roleQuery = filterRole === 'ALL' ? '' : filterRole;
        const res = await fetch(`/user?page=${1}&role=${roleQuery}`, {
          method: 'GET',
        });
        if (!res.ok) {
          throw new Error('Failed to fetch user list');
        }
        const responseData = await res.json();
        if (Array.isArray(responseData) && responseData.length > 0) {
          const { data: userList } = responseData[0];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const enrichedList: UserData[] = userList.map((u: any) => ({
            ...u,
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
  const filteredData = useMemo(() => {
    let data = users;
    if (searchTerm.trim() !== '') {
      data = data.filter((u) =>
        u.nickname.includes(searchTerm.trim())
      );
    }
    return data;
  }, [users, searchTerm]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleUserClick = (user: UserData) => {
    setSelectedUser(user);
  };
  const handleEditIconClick = () => {
    if (!selectedUser) return;
    setIsModalOpen(true);
  };
  const handleSaveUserChanges = (updated: UserData) => {
    const updatedList = users.map((u) =>
      u.id === updated.id ? { ...u, ...updated } : u
    );
    setUsers(updatedList);
    setSelectedUser(updated);
    setIsModalOpen(false);
  };

  const handleOpenPointModal = () => {
    if (!selectedUser) return;
    setIsPointModalOpen(true);
  };
  const handleSavePointChanges = (updated: UserData) => {
    const updatedList = users.map((u) =>
      u.id === updated.id ? { ...u, ...updated } : u
    );
    setUsers(updatedList);
    setSelectedUser(updated);
    setIsPointModalOpen(false);
  };
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

    const updatedList = users.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    );
    setUsers(updatedList);
    setSelectedUser(updatedUser);

    setIsSettingModalOpen(false);
  };

  return (
    <div className="admin-container">
      <div className="admin-content-wrapper">
        {/* 좌측 (검색 + 필터 + 테이블 + 페이지네이션) */}
        <div className="left-side">
          {/* 검색창 */}
          <div className="search-section">
            <input
              className="search-input"
              placeholder="닉네임 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 필터 버튼 */}
          <div className="filter-section">
            {['ALL', 'DevRel', 'Core', 'Member', 'Junior'].map((roleValue) => (
              <button
                key={roleValue}
                className={`filter-btn ${filterRole === roleValue ? 'active' : ''}`}
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
          <table className="member-table">
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
                    className={selectedUser?.id === u.id ? 'selected-row' : ''}
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
          <div className="pagination-row">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`page-btn ${p === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 우측 (선택된 유저 상세) */}
        {selectedUser && (
          <div className="member-detail-section">
            <div className="detail-header">
              {/* 프로필 이미지 (mock) */}
              <Image
                src={
                  selectedUser.profileImageUrl && selectedUser.profileImageUrl.trim() !== ''
                    ? selectedUser.profileImageUrl
                    : '/profile.svg'
                }
                alt="프로필 이미지"
                className="manage-profile-image"
                width={120}
                height={120}
              />
              <h2>
                {selectedUser.nickname}
                <span className="edit-icon" onClick={handleEditIconClick}>
                  ✏️
                </span>
              </h2>
              <div className="detail-role">
                {selectedUser.roles.map((r) => r.role).join(', ')}
              </div>
              <div className="detail-point">
                <strong>
                  {selectedUser.roles.reduce((sum, r) => sum + r.point, 0)}
                </strong>{' '}
                P
                <button className="point-edit-btn" onClick={handleOpenPointModal}>
                  포인트 수정
                </button>
              </div>
            </div>

            {/* 점수 수정 히스토리 (mock) */}
            <div className="score-history">
              <h3>점수 수정 히스토리</h3>
              <div className="score-history-table">
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
                    {selectedUser.logs?.length ? (
                      selectedUser.logs.map((log, idx) => (
                        <tr key={idx}>
                          <td>{log.date}</td>
                          <td>{log.name}</td>
                          <td>{log.role}</td>
                          <td>
                            {log.pointChange > 0 ? `+${log.pointChange}` : `${log.pointChange}`}
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

            {/* 활동 관리 (mock) */}
            <div className="activity-manage">
              <h3>활동 관리</h3>
              <div className="tabs">
                {activityTabs.map((tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
                {/* 설정 아이콘 */}
                <button className="tab-setting-btn" onClick={handleOpenSettingModal}>
                  <Image src="/settingicon.svg" alt="설정" width={24} height={24} />
                </button>
              </div>
              <div className="tab-content">
                {activeTab === 'fetch' && (
                  <div className="activity-panel">
                    {selectedUser.activities?.fetch?.map((item, idx) => (
                      <p key={idx}>{item}</p>
                    ))}
                  </div>
                )}
                {activeTab === 'worktree' && (
                  <div className="activity-panel">
                    {selectedUser.activities?.worktree?.map((item, idx) => (
                      <p key={idx}>{item}</p>
                    ))}
                  </div>
                )}
                {activeTab === 'branch' && (
                  <div className="activity-panel">
                    {selectedUser.activities?.branch?.map((item, idx) => (
                      <p key={idx}>{item}</p>
                    ))}
                  </div>
                )}
                {activeTab === 'solution challenge' && (
                  <div className="activity-panel">
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
