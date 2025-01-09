import React, { useState, ChangeEvent } from 'react';
import './ModalEditMember.css';
import { MemberData } from '@/app/admin/management/page';

interface ModalEditMemberProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberData;
  onSave: (updated: MemberData) => void;
}

export default function ModalEditMember({
  isOpen,
  onClose,
  member,
  onSave,
}: ModalEditMemberProps) {
  const [editName, setEditName] = useState(member.name);
  const [editMajor, setEditMajor] = useState('컴퓨터학과 22학번');
  const [editPosition, setEditPosition] = useState(member.position);
  const [editRole, setEditRole] = useState(member.role);
  const [editProfileUrl, setEditProfileUrl] = useState(member.profileImageUrl || '');

  if (!isOpen) return null;

  // 저장 버튼 클릭 시
  const handleSave = () => {
    const updatedMember: MemberData = {
      ...member,
      name: editName,
      // major / 학번은 MemberData에 없어서 
      // 필요하면 MemberData를 확장하시거나, 백엔드에 맞춰 로직 수정
      position: editPosition,
      role: editRole,
      profileImageUrl: editProfileUrl,
    };
    onSave(updatedMember);
  };

  // 프로필 이미지 변경 시 (URL 입력받는 경우로  )
  const handleProfileUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditProfileUrl(e.target.value);
  };

  return (
    <div className="modal-edit-member-backdrop">
      <div className="modal-edit-member-content">
        <button className="modal-close-button" onClick={onClose}>
          ✕
        </button>
        <h2>멤버 정보 수정</h2>

        {/* 프로필 이미지 (미리보기) */}
        <div className="profile-preview-container">
          <img
            className="profile-preview-img"
            src={editProfileUrl.trim() !== '' ? editProfileUrl : '/profile.svg'}
            alt="프로필 미리보기"
          />
        </div>

        <label>
          이름
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        </label>
        <label>
          학과·학번 (예: 컴퓨터학과 22학번)
          <input
            type="text"
            value={editMajor}
            onChange={(e) => setEditMajor(e.target.value)}
          />
        </label>
        <label>
          포지션
          <select
            value={editPosition}
            onChange={(e) => setEditPosition(e.target.value as MemberData['position'])}
          >
            <option value="FE">FE</option>
            <option value="BE">BE</option>
            <option value="AI">AI</option>
            <option value="DSGN">DSGN</option>
            <option value="DevRel">DevRel</option>
          </select>
        </label>
        <label>
          레벨 (role)
          <select
            value={editRole}
            onChange={(e) => setEditRole(e.target.value as MemberData['role'])}
          >
            <option value="Core">Core</option>
            <option value="DevRel">DevRel</option>
            <option value="Member">Member</option>
            <option value="Junior">Junior</option>
          </select>
        </label>

        <label>
          프로필 이미지 URL
          <input
            type="text"
            value={editProfileUrl}
            onChange={handleProfileUrlChange}
          />
        </label>

        <div className="modal-buttons">
          <button className="save-button" onClick={handleSave}>
            저장
          </button>
          <button className="cancel-button" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
