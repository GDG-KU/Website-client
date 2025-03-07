'use client';

import React, { useState, useEffect } from 'react';
import { UserData } from './page';
import styles from './ModalEditPoint.module.css';

interface ModalEditPointProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onSave: (updated: UserData) => void;
}

export default function ModalEditPoint({
  isOpen,
  onClose,
  user,
  onSave,
}: ModalEditPointProps) {
  const [pointChange, setPointChange] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPointChange('');
      setReason('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSave = () => {
    const diff = parseInt(pointChange, 10);
    if (isNaN(diff)) {
      alert('포인트 수정값은 숫자여야 합니다.');
      return;
    }

    // 첫 번째 role의 point에 diff 반영 (간단 예시)
    const newRoles = [...user.roles];
    if (newRoles.length > 0) {
      newRoles[0].point = newRoles[0].point + diff;
    }

    // logs mock
    const newLog = {
      date: new Date().toISOString().slice(0, 10),
      name: user.nickname,
      role: (newRoles[0]?.role || '').toUpperCase(),
      pointChange: diff,
      reason: reason || '(사유 미입력)',
    };
    const updatedLogs = user.logs ? [...user.logs, newLog] : [newLog];

    const updatedUser: UserData = {
      ...user,
      roles: newRoles,
      logs: updatedLogs,
    };

    // 실제 API가 있다면 /point POST or PATCH 등 호출
    /*
    await fetch('/point', {
      method: 'POST',
      body: JSON.stringify({ userId: user.id, role: newRoles[0].role, point: diff }),
      ...
    });
    */

    onSave(updatedUser);
  };

  return (
    <div className={styles['modal-edit-point-backdrop']} onClick={onClose}>
      <div
        className={styles['modal-edit-point-content']}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles['modal-close-button']} onClick={onClose}>
          ✕
        </button>
        <div className={styles['modal-body']}>
          {/* 왼쪽 영역이 필요하다면 styles['modal-left'] 사용 */}
          <div className={styles['modal-right']}>
            <div className={styles['current-point']}>
              현재 포인트{' '}
              <strong>
                {user.roles.reduce((sum, r) => sum + r.point, 0)}
              </strong> P
            </div>

            <div className={styles['point-edit-row']}>
              <label>포인트 수정</label>
              <input
                type="text"
                placeholder="예: +5 / -3"
                value={pointChange}
                onChange={(e) => setPointChange(e.target.value)}
              />
            </div>

            <div className={styles['reason-row']}>
              <label>사유</label>
              <input
                type="text"
                placeholder="사유 입력"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <button className={styles['save-button']} onClick={handleSave}>
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
