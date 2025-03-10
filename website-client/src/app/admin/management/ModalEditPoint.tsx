'use client';

import React, { useState, useEffect } from 'react';
import { UserData } from './page';
import styles from './ModalEditPoint.module.css';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPointChange('');
      setReason('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const diff = parseInt(pointChange, 10);
    if (isNaN(diff)) {
      alert('포인트 수정값은 숫자여야 합니다.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/point`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          role: user.roles[0]?.role || '',
          point: diff,
          reason: reason || '(사유 미입력)',
        }),
      });
      if (!res.ok) {
        throw new Error('포인트 수정에 실패하였습니다.');
      }
      const result = await res.json();
      // API 응답 예시: { role: "Core", point: 400 }
      const newRoles = [...user.roles];
      if (newRoles.length > 0) {
        newRoles[0].point = result.point;
      }
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

      onSave(updatedUser);
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles['modal-edit-point-backdrop']}
      onClick={onClose}
    >
      <div
        className={styles['modal-edit-point-content']}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles['modal-close-button']} onClick={onClose}>
          ✕
        </button>
        <div className={styles['modal-body']}>
          <div className={styles['modal-right']}>
            <div className={styles['current-point']}>
              현재 포인트{' '}
              <strong>
                {user.roles.reduce((sum, r) => sum + r.point, 0)}
              </strong>{' '}
              P
            </div>

            <div className={styles['point-edit-row']}>
              <label>포인트 수정</label>
              <input
                type="text"
                placeholder="예: +5 / -3"
                value={pointChange}
                onChange={(e) => setPointChange(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className={styles['reason-row']}>
              <label>사유</label>
              <input
                type="text"
                placeholder="사유 입력"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              className={styles['save-button']}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
