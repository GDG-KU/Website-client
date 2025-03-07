'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { UserData } from './page';
import styles from './ModalEditMember.module.css';

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
      // 실제 PATCH /user/role
      const body = {
        user_id: user.id,
        roles: [editRole],
      };
      const response = await fetch('/user/role', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error('Failed to update user role');
      }
      const updatedData = await response.json();
      // updatedData 예: { id, nickname, roles: [{ role, point }] }

      // 로컬 state 업데이트
      const updatedUser: UserData = {
        ...user,
        nickname: editNickname,
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
        <h2>멤버 정보 수정</h2>

        <div className={styles['profile-preview-container']}>
          <Image
            className={styles['profile-preview-img']}
            src={editProfileUrl.trim() !== '' ? editProfileUrl : '/profile.svg'}
            alt="프로필 미리보기"
            width={120}
            height={120}
          />
        </div>

        <label>
          닉네임
          <input
            type="text"
            value={editNickname}
            onChange={(e) => setEditNickname(e.target.value)}
          />
        </label>

        <label>
          프로필 URL
          <input
            type="text"
            value={editProfileUrl}
            onChange={(e) => setEditProfileUrl(e.target.value)}
          />
        </label>

        <label>
          역할 (role)
          <select
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
          >
            <option value="Core">Core</option>
            <option value="DevRel">DevRel</option>
            <option value="Member">Member</option>
            <option value="Junior">Junior</option>
          </select>
        </label>

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
