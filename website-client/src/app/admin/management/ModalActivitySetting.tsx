'use client';

import React, { useState, useEffect } from 'react';
import { UserData } from './page';
import styles from './ModalActivitySetting.module.css';

interface ModalActivitySettingProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  user: UserData;
  onSave: (updated: string[]) => void;
}

export default function ModalActivitySetting({
  isOpen,
  onClose,
  activeTab,
  user,
  onSave,
}: ModalActivitySettingProps) {
  const [activityList, setActivityList] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    if (!isOpen || !user.activities) return;
    let currentList: string[] = [];
    if (activeTab === 'fetch') {
      currentList = user.activities.fetch;
    } else if (activeTab === 'worktree') {
      currentList = user.activities.worktree;
    } else if (activeTab === 'branch') {
      currentList = user.activities.branch;
    } else if (activeTab === 'solution challenge') {
      currentList = user.activities.solutionChallenge;
    }
    setActivityList(currentList || []);
    setNewItem('');
  }, [isOpen, activeTab, user]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setActivityList([...activityList, newItem.trim()]);
    setNewItem('');
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...activityList];
    updated.splice(index, 1);
    setActivityList(updated);
  };

  const handleSave = () => {
    onSave(activityList);
  };

  return (
    <div className={styles['modal-activity-setting-backdrop']} onClick={onClose}>
      <div
        className={styles['modal-activity-setting-content']}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles['close-btn']} onClick={onClose}>✕</button>
        <h2>활동 관리 설정 ({activeTab})</h2>

        <div className={styles['setting-body']}>
          <ul className={styles['item-list']}>
            {activityList.map((item, idx) => (
              <li key={idx}>
                <span>{item}</span>
                <button onClick={() => handleRemoveItem(idx)}>×</button>
              </li>
            ))}
          </ul>
          <div className={styles['add-row']}>
            <input
              type="text"
              placeholder="새 항목 입력"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <button onClick={handleAddItem}>추가하기</button>
          </div>
        </div>

        <div className={styles['modal-buttons']}>
          <button className={styles['save-btn-setting']} onClick={handleSave}>
            저장
          </button>
          <button className={styles['cancel-btn']} onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
