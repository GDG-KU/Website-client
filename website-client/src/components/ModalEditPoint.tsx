import React, { useState } from 'react';
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
  // 왼쪽 탭/내역
  const pointCategories = [
    '전체',
    '워크트리 관련 내역',
    'Fetch 관련 내역',
    'A 관련 내역',
    'B 관련 내역',
    'C 관련 내역',
  ];
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // 포인트 & 사유 입력
  const [pointChange, setPointChange] = useState('');
  const [reason, setReason] = useState('');

  // 저장하기
  const handleSave = () => {
    // 포인트 변동값을 숫자로
    const diff = parseInt(pointChange, 10);
    if (isNaN(diff)) {
      alert('포인트 수정값은 숫자여야 합니다.');
      return;
    }

    // 새로운 log 하나를 추가
    const newLog = {
      date: new Date().toISOString().slice(0, 10), // 예: "2025-01-09"
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

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-edit-point-backdrop">
      <div className="modal-edit-point-content">
        <button className="modal-close-button" onClick={onClose}>
          ✕
        </button>
        <div className="modal-body">
          {/* 왼쪽: 카테고리 목록 */}
          <div className="modal-left">
            {pointCategories.map((cat, idx) => (
              <button
                key={idx}
                className={`left-category-btn ${
                  selectedCategory === cat ? 'active' : ''
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
              /*
                오른쪽에 표시될 내용을 여기서 상태로 관리하거나,
                단순히 목록만 보여주고 사용하는 등 자유
               */
            ))}
          </div>

          {/* 오른쪽: 현재 포인트 / 포인트 수정 / 사유 / 저장버튼 */}
          <div className="modal-right">
            <div className="current-point">현재 포인트 <strong>{member.points}P</strong></div>

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
