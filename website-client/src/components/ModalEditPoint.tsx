import React, { useState, useEffect } from 'react';
import './ModalEditPoint.css';
import { MemberData } from '@/app/admin/management/page';

interface ModalEditPointProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberData;
  onSave: (updated: MemberData) => void;
}

export default function ModalEditPoint({
  isOpen,
  onClose,
  member,
  onSave,
}: ModalEditPointProps) {
  // 왼쪽 탭/내역 (데모)
  const pointCategories = [
    '전체',
    '워크트리 관련 내역',
    'Fetch 관련 내역',
    'A 관련 내역',
    'B 관련 내역',
    'C 관련 내역',
  ];

  // 선택된 카테고리 상태
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  // 포인트 & 사유 입력 상태
  const [pointChange, setPointChange] = useState('');
  const [reason, setReason] = useState('');

  // 모달 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory('전체');
      setPointChange('');
      setReason('');
    }
  }, [isOpen, member]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    // 포인트 변동값을 숫자로
    const diff = parseInt(pointChange, 10);
    if (isNaN(diff)) {
      alert('포인트 수정값은 숫자여야 합니다.');
      return;
    }

    // 새로운 log 하나를 추가
    const newLog = {
      date: new Date().toISOString().slice(0, 10),
      name: member.name,
      role: member.role.toUpperCase(),
      pointChange: diff,
      reason: reason || '(사유 미입력)',
    };

    // 기존 포인트에 diff 반영
    const updatedPoints = member.points + diff;
    // 기존 logs 배열에 newLog 추가
    const updatedLogs = member.logs ? [...member.logs, newLog] : [newLog];

    const updatedMember: MemberData = {
      ...member,
      points: updatedPoints,
      logs: updatedLogs,
    };

    onSave(updatedMember);
  };

  return (
    <div className="modal-edit-point-backdrop">
      <div className="modal-edit-point-content">
        <button className="modal-close-button" onClick={onClose}>
          ✕
        </button>
        <div className="modal-body">
          {/* 왼쪽 카테고리 */}
          <div className="modal-left">
            {pointCategories.map((cat, idx) => (
              <button
                key={idx}
                className={`left-category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 오른쪽 입력 */}
          <div className="modal-right">
            <div className="current-point">
              현재 포인트 <strong>{member.points}P</strong>
            </div>

            <div className="point-edit-row">
              <label>포인트 수정</label>
              <input
                type="text"
                placeholder="직접 입력"
                value={pointChange}
                onChange={(e) => setPointChange(e.target.value)}
              />
            </div>

            <div className="reason-row">
              <label>사유</label>
              <input
                type="text"
                placeholder="직접 입력"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <button className="save-button" onClick={handleSave}>
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
