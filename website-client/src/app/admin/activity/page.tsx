'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import styles from './activityManagement.module.css';
import ModalActivitySetting from './ModalActivitySetting';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UserRole {
  role: string;
  point: number;
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
  activities?: Activities;
}

interface ServerUser {
  id: number;
  nickname: string;
  roles?: { role: string; point: number }[];
  profileImageUrl?: string;
}

const activityTabs = ['fetch', 'worktree', 'branch', 'solution challenge'];

export default function ActivityManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] =
    useState<'ALL' | 'DevRel' | 'Core' | 'Member' | 'Junior'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('fetch');
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const url = `${API_BASE_URL}/user?page=1`;
      try {
        const res = await fetchWithAuth(url, { method: 'GET' });
        if (!res.ok) {
          throw new Error('Failed to fetch user list');
        }
        const responseData = await res.json();
        let userList: ServerUser[] = [];
        if (Array.isArray(responseData) && responseData.length > 0) {
          userList = responseData[0].data;
        } else if (responseData && typeof responseData === 'object' && 'data' in responseData) {
          userList = responseData.data;
        }
        const enrichedList: UserData[] = userList.map((u) => ({
          id: u.id,
          nickname: u.nickname,
          roles: u.roles || [],
          profileImageUrl: u.profileImageUrl || '',
          activities: {
            fetch: [],
            worktree: [],
            branch: [],
            solutionChallenge: [],
          },
        }));
        setUsers(enrichedList);
      } catch (err) {
        console.error('ActivityManagementPage - 사용자 목록 가져오기 실패:', err);
      }
    };
    fetchUsers();
  }, [filterRole]);

  const filteredData = useMemo(() => {
    let data = users;
    if (searchTerm.trim() !== '') {
      data = data.filter((u) =>
        u.nickname.toLowerCase().includes(searchTerm.trim().toLowerCase())
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
    const updatedUser: UserData = { ...selectedUser, activities: newActivities };
    setSelectedUser(updatedUser);
    const updatedList = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedList);
    setIsSettingModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* 왼쪽: 사용자 목록 */}
        <div className={styles.leftSide}>
          <div className={styles.searchSection}>
            <input
              className={styles.searchInput}
              placeholder="닉네임 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.filterSection}>
            {['ALL', 'DevRel', 'Core', 'Member', 'Junior'].map((roleValue) => (
              <button
                key={roleValue}
                className={`${styles.filterBtn} ${filterRole === roleValue ? styles.active : ''}`}
                onClick={() => {
                  setFilterRole(roleValue as typeof filterRole);
                  setCurrentPage(1);
                }}
              >
                {roleValue}
              </button>
            ))}
          </div>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>닉네임</th>
                <th>역할</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((u) => {
                const roleString = u.roles.map((r) => r.role).join(', ');
                return (
                  <tr
                    key={u.id}
                    className={selectedUser?.id === u.id ? styles.selectedRow : ''}
                    onClick={() => handleUserClick(u)}
                  >
                    <td>{u.nickname}</td>
                    <td>{roleString}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

        {/* 오른쪽: 선택된 사용자의 활동관리 영역 */}
        {selectedUser && (
          <div className={styles.activitySection}>
            <div className={styles.userHeader}>
              <Image
                src={
                  selectedUser.profileImageUrl && selectedUser.profileImageUrl.trim() !== ''
                    ? selectedUser.profileImageUrl
                    : '/profile.svg'
                }
                alt="프로필 이미지"
                className={styles.profileImage}
                width={60}
                height={60}
              />
              <h2>{selectedUser.nickname}</h2>
            </div>
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
