'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { UserData } from './page';
import styles from './ModalEditMember.module.css';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ModalEditUserProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onSave: (updated: UserData) => void;
}

export default function ModalEditUser({
  isOpen,
  onClose,
  user,
  onSave,
}: ModalEditUserProps) {
  const [editNickname, setEditNickname] = useState(user.nickname);
  const [editProfileUrl, setEditProfileUrl] = useState(user.profileImageUrl || '');
  const [editRole, setEditRole] = useState(user.roles[0]?.role || '');

  useEffect(() => {
    if (isOpen) {
      setEditNickname(user.nickname);
      setEditProfileUrl(user.profileImageUrl || '');
      setEditRole(user.roles[0]?.role || '');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      // PATCH /user/role 엔드포인트를 호출하여 유저 역할 변경
      const body = {
        user_id: user.id,
        roles: [editRole],
      };
      const response = await fetchWithAuth(`${API_BASE_URL}/user/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error('유저 역할 변경에 실패하였습니다.');
      }
      const updatedData = await response.json();
      
      // API 명세에서는 PATCH /user/role 응답으로
      // { "id": 1, "nickname": "User nickname", "roles": [ { "role": "Role name", "point": 0 } ] } 형태로 리턴됨
      // 따라서 nickname은 서버의 응답을 따르되, 프로필 URL은 기존 값을 그대로 사용합니다.
      const updatedUser: UserData = {
        ...user,
        nickname: editNickname, // 혹은 updatedData.nickname을 사용할 수 있음
        profileImageUrl: editProfileUrl,
        roles: updatedData.roles,
      };
      onSave(updatedUser);
    } catch (err) {
      console.error(err);
      alert('역할 변경 실패');
    }
  };

  return (
    <div className={styles['modal-edit-member-backdrop']} onClick={onClose}>
      <div
        className={styles['modal-edit-member-content']}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles['modal-close-button']} onClick={onClose}>
          ✕
        </button>

        <h2 className={styles['modal-title']}>멤버 정보 수정</h2>

        <div className={styles['profile-preview-container']}>
          <Image
            className={styles['profile-preview-img']}
            src={editProfileUrl.trim() !== '' ? editProfileUrl : '/profile.svg'}
            alt="프로필 미리보기"
            width={120}
            height={120}
          />
        </div>

        {/* 닉네임 */}
        <div className={styles['formRow']}>
          <label className={styles['formLabel']}>닉네임</label>
          <input
            className={styles['formInput']}
            type="text"
            value={editNickname}
            onChange={(e) => setEditNickname(e.target.value)}
          />
        </div>

        {/* 프로필 URL */}
        <div className={styles['formRow']}>
          <label className={styles['formLabel']}>프로필 URL</label>
          <input
            className={styles['formInput']}
            type="text"
            value={editProfileUrl}
            onChange={(e) => setEditProfileUrl(e.target.value)}
          />
        </div>

        {/* 역할 */}
        <div className={styles['formRow']}>
          <label className={styles['formLabel']}>역할 (role)</label>
          <select
            className={styles['formInput']}
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
          >
            <option value="Core">Core</option>
            <option value="DevRel">DevRel</option>
            <option value="Member">Member</option>
            <option value="Junior">Junior</option>
          </select>
        </div>

        <div className={styles['modal-buttons']}>
          <button className={styles['save-button-mem']} onClick={handleSave}>
            저장
          </button>
          <button className={styles['cancel-button-mem']} onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
