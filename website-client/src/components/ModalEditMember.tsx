import React, { useState, ChangeEvent, useEffect } from 'react';
import './ModalEditMember.css';
import { MemberData } from '@/app/admin/management/page';
import Image from 'next/image';

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

  useEffect(() => {
    if (isOpen) {
      setEditName(member.name);
      setEditMajor('컴퓨터학과 22학번');
      setEditPosition(member.position);
      setEditRole(member.role);
      setEditProfileUrl(member.profileImageUrl || '');
    }
  }, [isOpen, member]);

  if (!isOpen) return null;

  const handleSave = () => {
    const updatedMember: MemberData = {
      ...member,
      name: editName,
      position: editPosition,
      role: editRole,
      profileImageUrl: editProfileUrl,
    };
    onSave(updatedMember);
  };

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

        <div className="profile-preview-container">
          <Image
            className="profile-preview-img"
            src={editProfileUrl.trim() !== '' ? editProfileUrl : '/profile.svg'}
            alt="프로필 미리보기"
            width={120}
            height={120}
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

        <div className="modal-buttons">
          <button className="save-button-mem" onClick={handleSave}>
            저장
          </button>
          <button className="cancel-button-mem" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
