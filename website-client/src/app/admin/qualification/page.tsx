'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styles from './qualification.module.css';

interface User {
  id: number;
  nickname: string;
  department: string;   // 예: "컴퓨터공학과"
  studentNumber: string; // 예: "2022"
  position: string;      // 예: "FE", "BE", ...
  isAdmin: boolean;      // true면 이미 관리자
}

interface MemberResponse {
  id: number;
  nickname: string;
  department: string;
  student_number: string;
  position: string;
  isAdmin: boolean;
}

const roleFilters = ['ALL', 'DevRel', 'Core', 'Member', 'Junior'];

export default function QualificationPage() {
  // (1) 전체 멤버 목록
  const [users, setUsers] = useState<User[]>([]);

  // (2) 검색, 필터
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');

  // (3) 선택된 멤버
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // (4) 관리자 추가/삭제 모달 상태
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmType, setConfirmType] = useState<'ADD' | 'REMOVE'>('ADD');

  // -------------------------------
  // (A) 멤버 목록 불러오기
  // -------------------------------
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const roleQuery = filterRole === 'ALL' ? '' : filterRole;
        const res = await fetch(`/user?role=${roleQuery}`, { method: 'GET' });
        if (!res.ok) throw new Error('Failed to fetch members');
        const data: MemberResponse[] = await res.json();
        const mapped: User[] = data.map((item: MemberResponse) => ({
          id: item.id,
          nickname: item.nickname,
          department: item.department,
          studentNumber: item.student_number,
          position: item.position,
          isAdmin: item.isAdmin,
        }));
        setUsers(mapped);
      } catch (err) {
        console.error('멤버 목록 조회 실패:', err);
      }
    };
    fetchMembers();
  }, [filterRole]);

  // -------------------------------
  // (B) 검색 필터
  // -------------------------------
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return users;
    return users.filter((u) =>
      u.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // -------------------------------
  // (C) 멤버 선택
  // -------------------------------
  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  // -------------------------------
  // (D) 관리자 추가/삭제 버튼 클릭
  // -------------------------------
  const handleAddAdminClick = () => {
    setConfirmType('ADD');
    setShowConfirmModal(true);
  };
  const handleRemoveAdminClick = () => {
    setConfirmType('REMOVE');
    setShowConfirmModal(true);
  };

  // 모달에서 "확인" 버튼 클릭 시
  const handleConfirmAdmin = async () => {
    if (!selectedUser) return;
    try {
      if (confirmType === 'ADD') {
        // 예: POST /admin/add, body: { userId: selectedUser.id }
        const res = await fetch('/admin/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: selectedUser.id }),
        });
        if (!res.ok) throw new Error('관리자 추가 실패');
        alert('추가되었습니다.');
        setSelectedUser({ ...selectedUser, isAdmin: true });
      } else {
        // 예: POST /admin/remove, body: { userId: selectedUser.id }
        const res = await fetch('/admin/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: selectedUser.id }),
        });
        if (!res.ok) throw new Error('관리자 삭제 실패');
        alert('삭제되었습니다.');
        setSelectedUser({ ...selectedUser, isAdmin: false });
      }
    } catch (err) {
      console.error(err);
      alert('오류가 발생했습니다.');
    } finally {
      setShowConfirmModal(false);
    }
  };

  return (
    <div className={styles.qualificationContainer}>
      {/* (1) 상단 검색창 + 필터 */}
      <div className={styles.topBar}>
        <input
          className={styles.searchInput}
          placeholder="검색하기"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.filterRow}>
        {roleFilters.map((r) => (
          <button
            key={r}
            className={`${styles.filterButton} ${
              filterRole === r ? styles.active : ''
            }`}
            onClick={() => setFilterRole(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <div className={styles.contentWrapper}>
        {/* (2) 왼쪽: 멤버 목록 */}
        <div className={styles.leftPanel}>
          <ul className={styles.memberList}>
            {filteredData.map((user) => (
              <li
                key={user.id}
                className={selectedUser?.id === user.id ? styles.selectedItem : ''}
                onClick={() => handleUserClick(user)}
              >
                {user.nickname}
                <span className={styles.smallRole}>
                  {user.position || 'N/A'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* (3) 오른쪽: 선택된 멤버 정보 */}
        <div className={styles.rightPanel}>
          {selectedUser ? (
            <div className={styles.userDetail}>
              <div className={styles.userHeader}>
                <div className={styles.userName}>{selectedUser.nickname}</div>
                <div className={styles.userInfo}>
                  {selectedUser.department} {selectedUser.studentNumber}학번
                </div>
                <div className={styles.userPosition}>{selectedUser.position}</div>

                {/* 관리자 추가/삭제 버튼 */}
                {selectedUser.isAdmin ? (
                  <button
                    className={styles.adminButtonRemove}
                    onClick={handleRemoveAdminClick}
                  >
                    관리자 삭제
                  </button>
                ) : (
                  <button
                    className={styles.adminButtonAdd}
                    onClick={handleAddAdminClick}
                  >
                    관리자 추가
                  </button>
                )}
              </div>

              {/* (예시) 추가적인 정보 */}
              <div className={styles.userBody}>
                <p>권한 부여 내용</p>
                <ul>
                  <li>...</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className={styles.emptyDetail}>사용자를 선택해주세요</div>
          )}
        </div>
      </div>

      {/* (4) 관리자 추가/삭제 모달 */}
      {showConfirmModal && selectedUser && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>
              {selectedUser.nickname} 님을 관리자에{' '}
              {confirmType === 'ADD' ? '추가' : '삭제'} 하시겠습니까?
            </h3>
            <div className={styles.modalButtons}>
              <button
                className={styles.confirmButton}
                onClick={handleConfirmAdmin}
              >
                {confirmType === 'ADD' ? '추가' : '삭제'}
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowConfirmModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
