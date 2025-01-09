import React, { useState, useEffect } from 'react';
import './ModalActivitySetting.css';
import { MemberData } from '@/app/admin/management/page';

interface ModalActivitySettingProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  member: MemberData;
  onSave: (updated: string[]) => void;
}

export default function ModalActivitySetting({
  isOpen,
  onClose,
  activeTab,
  member,
  onSave,
}: ModalActivitySettingProps) {
  // 모달에서 편집할 활동 목록
  const [activityList, setActivityList] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  // 모달이 열릴 때, member의 현재 활동 목록을 가져와 state에 복사
  useEffect(() => {
    if (!isOpen) return; 
    if (!member.activities) return;
    let currentList: string[] = [];
    if (activeTab === 'fetch') {
      currentList = member.activities.fetch;
    } else if (activeTab === 'worktree') {
      currentList = member.activities.worktree;
    } else if (activeTab === 'branch') {
      currentList = member.activities.branch;
    } else if (activeTab === 'solution challenge') {
      currentList = member.activities.solutionChallenge;
    }
    setActivityList(currentList || []);
    setNewItem('');
  }, [isOpen, activeTab, member]);

  if (!isOpen) {
    return null;
  }

  // 항목 추가
  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setActivityList([...activityList, newItem.trim()]);
    setNewItem('');
  };

  // 항목 삭제
  const handleRemoveItem = (index: number) => {
    const updated = [...activityList];
    updated.splice(index, 1);
    setActivityList(updated);
  };

  // 저장
  const handleSave = () => {
    // 상위로 넘김
    onSave(activityList);
  };

  return (
    <div className="modal-activity-setting-backdrop">
      <div className="modal-activity-setting-content">
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <h2>활동 관리 설정 ({activeTab})</h2>

        <div className="setting-body">
          {/* 기존 목록 */}
          <ul className="item-list">
            {activityList.map((item, idx) => (
              <li key={idx}>
                <span>{item}</span>
                <button onClick={() => handleRemoveItem(idx)}>×</button>
              </li>
            ))}
          </ul>

          {/* 새 항목 추가 */}
          <div className="add-row">
            <input
              type="text"
              placeholder="새 항목 입력"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <button onClick={handleAddItem}>추가하기</button>
          </div>
        </div>

        <div className="modal-buttons">
          <button className="save-btn-setting" onClick={handleSave}>저장</button>
          <button className="cancel-btn" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
