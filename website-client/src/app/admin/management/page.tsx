'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import styles from './management.module.css';
import ModalEditUser from './ModalEditUser';
import ModalEditPoint from './ModalEditPoint';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

interface ServerUser {
  id: number;
  nickname: string;
  roles?: { role: string; point: number }[];
  profileImageUrl?: string;
}

interface ServerLogData {
  id: number;
  point_change: number;
  role: string;
  reason: string;
  accumulated_point: number;
  date: string;
}

export default function ManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] =
    useState<'ALL' | 'DevRel' | 'Core' | 'Member' | 'Junior'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);

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
          logs: [],
        }));
        setUsers(enrichedList);
      } catch (err) {
        console.error('Failed to fetch user list:', err);
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

  const handleUserClick = async (user: UserData) => {
    setSelectedUser(null);
    try {
      const pointUrl = `${API_BASE_URL}/point/${user.id}`;
      const pointRes = await fetchWithAuth(pointUrl, { method: 'GET' });
      let userPoints: UserRole[] | null = null;
      if (pointRes.ok) {
        userPoints = await pointRes.json();
      }
      const historyUrl = `${API_BASE_URL}/point/history/${user.id}`;
      const historyRes = await fetchWithAuth(historyUrl, { method: 'GET' });
      let historyData: ServerLogData[] = [];
      if (historyRes.ok) {
        historyData = await historyRes.json();
      }
      const logs = historyData.map<LogData>((item) => ({
        date: item.date,
        name: user.nickname,
        role: item.role,
        pointChange: item.point_change,
        reason: item.reason,
        accumulated_point: item.accumulated_point,
      }));
      const updatedUser: UserData = {
        ...user,
        roles: userPoints || user.roles,
        logs: logs,
      };
      setSelectedUser(updatedUser);
    } catch (error) {
      console.error('User detail fetch failed:', error);
      setSelectedUser(user);
    }
  };

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

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminContentWrapper}>
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
                    className={selectedUser?.id === u.id ? styles.selectedRow : ''}
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

            {/* 확장된 점수 수정 히스토리 영역 */}
            <div className={styles.scoreHistoryLong}>
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
          </div>
        )}
      </div>

      {selectedUser && (
        <ModalEditUser
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
          onSave={handleSaveUserChanges}
        />
      )}
      {selectedUser && (
        <ModalEditPoint
          isOpen={isPointModalOpen}
          onClose={() => setIsPointModalOpen(false)}
          user={selectedUser}
          onSave={handleSavePointChanges}
        />
      )}
    </div>
  );
}
