'use client';

import React, { useState, useMemo, useEffect } from 'react';
import './management.css'; 
import Image from 'next/image';
import Link from 'next/link';

import ModalEditMember from '@/components/ModalEditMember';
import ModalEditPoint from '@/components/ModalEditPoint';
import ModalActivitySetting from '@/components/ModalActivitySetting';

/** 로그 데이터 */
interface LogData {
  date: string;
  name: string;
  role: string;
  pointChange: number;
  reason: string;
}

/** 멤버 데이터 인터페이스 */
export interface MemberData {
  name: string;
  role: 'Core' | 'DevRel' | 'Member' | 'Junior';
  position: 'FE' | 'BE' | 'AI' | 'DSGN' | 'DevRel';
  points: number;
  logs?: LogData[];
  profileImageUrl?: string;

  // 탭별 활동 관리 데이터
  activities?: {
    fetch: string[];
    worktree: string[];
    branch: string[];
    solutionChallenge: string[];
  };
}

/** 활동 관리 탭 */
const activityTabs = ['fetch', 'worktree', 'branch', 'solution challenge'];

export default function AdminPage() {
  // 멤버 목록
  const [members, setMembers] = useState<MemberData[]>([]);

  // 검색어 / 필터 / 페이지
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] =
    useState<'ALL' | 'DevRel' | 'Core' | 'Member' | 'Junior'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;

  // 선택된 멤버 / 탭 / 모달 상태
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('fetch');
  const [isModalOpen, setIsModalOpen] = useState(false);       // 회원정보 수정
  const [isPointModalOpen, setIsPointModalOpen] = useState(false); // 포인트 수정
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false); // 활동관리 세팅

  /** mockData를 받아오는 이펙트 */
  useEffect(() => {
    //fetch('/api/members')
    const mockData: MemberData[] = [
      {
        name: '김성훈',
        role: 'Member',
        position: 'AI',
        points: 80,
        logs: [],
        activities: {
          fetch: ['Website', 'Design System', 'History', 'Goody Project', '팀별 프로젝트'],
          worktree: [],
          branch: [],
          solutionChallenge: [],
        },
      },
      {
        name: '김도연',
        role: 'Core',
        position: 'BE',
        points: 120,
        logs: [],
        activities: {
          fetch: ['Website', 'Design System'],
          worktree: ['Worktree 초기 기여'],
          branch: [],
          solutionChallenge: [],
        },
      },
      {
        name: '김서훈',
        role: 'Core',
        position: 'DSGN',
        points: 85,
        logs: [
          {
            date: '2024-08-01',
            name: '김서훈',
            role: 'CORE',
            pointChange: 5,
            reason: '디자인 시스템 개선',
          },
        ],
        activities: {
          fetch: ['디자인 기여', 'UI/UX 점검'],
          worktree: [],
          branch: ['DS 브랜치'],
          solutionChallenge: [],
        },
      },
      {
        name: '김민재',
        role: 'Member',
        position: 'DSGN',
        points: 115,
        logs: [],
        activities: {
          fetch: [],
          worktree: ['Worktree 기획'],
          branch: [],
          solutionChallenge: [],
        },
      },
      {
        name: '김유진',
        role: 'Member',
        position: 'AI',
        points: 110,
        logs: [
          {
            date: '2024-11-10',
            name: '김유진',
            role: 'MEMBER',
            pointChange: 3,
            reason: 'AI 모델 성능 향상 발표',
          },
        ],
        activities: {
          fetch: [],
          worktree: [],
          branch: [],
          solutionChallenge: ['2023 SC 참여', '2024 SC 보조 기여'],
        },
      },
      {
        name: '김하빈',
        role: 'Core',
        position: 'DevRel',
        points: 90,
        logs: [
          {
            date: '2024-09-20',
            name: '김하빈',
            role: 'CORE',
            pointChange: 10,
            reason: 'DevRel 행사 운영',
          },
        ],
        activities: {
          fetch: ['fetch 발표 준비'],
          worktree: [],
          branch: ['branch 튜토리얼 작성'],
          solutionChallenge: [],
        },
      },
      {
        name: '나을솔',
        role: 'Member',
        position: 'DSGN',
        points: 115,
        logs: [],
        activities: {
          fetch: [],
          worktree: [],
          branch: [],
          solutionChallenge: [],
        },
      },
      {
        name: '도지훈',
        role: 'Core',
        position: 'FE',
        points: 120,
        logs: [
          { date: '2024. 11. 24', name: '도지훈', role: 'CORE', pointChange: -3, reason: 'worktree 분할' },
          { date: '2024. 11. 17', name: '도지훈', role: 'CORE', pointChange: +5, reason: 'Hackathon 참석' },
          { date: '2024. 09. 03', name: '도지훈', role: 'CORE', pointChange: +5, reason: 'merge 참석' },
          { date: '2024. 07. 11', name: '도지훈', role: 'CORE', pointChange: -2, reason: 'fetch 발표' },
        ],
        profileImageUrl: '',
        activities: {
          fetch: ['Website', 'Design System', 'History', 'Goody Project', '방어기 프로젝트'],
          worktree: [],
          branch: [],
          solutionChallenge: [],
        },
      },
      {
        name: '도세린',
        role: 'Member',
        position: 'BE',
        points: 100,
        logs: [],
        activities: {
          fetch: ['Server fetch 로직 구현'],
          worktree: [],
          branch: [],
          solutionChallenge: [],
        },
      },
      {
        name: '박주원',
        role: 'Member',
        position: 'DSGN',
        points: 110,
        logs: [],
        activities: {
          fetch: [],
          worktree: [],
          branch: [],
          solutionChallenge: [],
        },
      },
      {
        name: '박세영',
        role: 'Core',
        position: 'FE',
        points: 125,
        logs: [
          {
            date: '2024-10-05',
            name: '박세영',
            role: 'CORE',
            pointChange: 5,
            reason: 'FE 리팩토링',
          },
        ],
        activities: {
          fetch: ['Refactoring FE'],
          worktree: [],
          branch: [],
          solutionChallenge: ['2023 SC 발표'],
        },
      },
      {
        name: '박재하',
        role: 'Member',
        position: 'BE',
        points: 75,
        activities: {
          fetch: [],
          worktree: [],
          branch: [],
          solutionChallenge: [],
        },
      },
      {
        name: '이리서',
        role: 'Core',
        position: 'FE',
        points: 60,
        activities: {
          fetch: ['FE Bugfix'],
          worktree: [],
          branch: [],
          solutionChallenge: [],
        },
      },
      {
        name: '이가윤',
        role: 'Member',
        position: 'FE',
        points: 135,
        activities: {
          fetch: [],
          worktree: ['Worktree 문서화'],
          branch: [],
          solutionChallenge: [],
        },
      },
      {
        name: '정민서',
        role: 'Member',
        position: 'BE',
        points: 115,
        activities: {
          fetch: [],
          worktree: [],
          branch: [],
          solutionChallenge: ['SC Mentor 참여'],
        },
      },
      // 추가로 1~2개 더
      {
        name: '한가영',
        role: 'Junior',
        position: 'AI',
        points: 20,
        logs: [],
        activities: {
          fetch: [],
          worktree: [],
          branch: [],
          solutionChallenge: [],
        },
      },
      {
        name: '오준혁',
        role: 'Junior',
        position: 'BE',
        points: 35,
        logs: [
          {
            date: '2024-09-15',
            name: '오준혁',
            role: 'JUNIOR',
            pointChange: 2,
            reason: '신입 OT 참석',
          },
        ],
        activities: {
          fetch: [],
          worktree: [],
          branch: [],
          solutionChallenge: [],
        },
      },
    ];
    setMembers(mockData);
  }, []);

  // --------------------------------------------------
  // 필터 + 검색
  // --------------------------------------------------
  const filteredData = useMemo(() => {
    let data = members;
    if (filterRole !== 'ALL') {
      data = data.filter((m) => m.role === filterRole);
    }
    if (searchTerm.trim() !== '') {
      data = data.filter((m) => m.name.includes(searchTerm.trim()));
    }
    return data;
  }, [members, filterRole, searchTerm]);

  // 페이지네이션
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // 멤버 클릭 → 상세
  const handleMemberClick = (member: MemberData) => {
    setSelectedMember(member);
  };

  // --------------------------------------------------
  // (A) 회원정보 수정 모달
  // --------------------------------------------------
  const handleEditIconClick = () => {
    if (!selectedMember) return;
    setIsModalOpen(true);
  };

  const handleSaveMemberChanges = (updated: MemberData) => {
    const updatedList = members.map((m) =>
      m.name === updated.name ? { ...m, ...updated } : m
    );
    setMembers(updatedList);
    setSelectedMember(updated);
    setIsModalOpen(false);
  };

  // --------------------------------------------------
  // (B) 포인트 수정 모달
  // --------------------------------------------------
  const handleOpenPointModal = () => {
    if (!selectedMember) return;
    setIsPointModalOpen(true);
  };

  const handleSavePointChanges = (updated: MemberData) => {
    const updatedList = members.map((m) =>
      m.name === updated.name ? { ...m, ...updated } : m
    );
    setMembers(updatedList);
    setSelectedMember(updated);
    setIsPointModalOpen(false);
  };

  // --------------------------------------------------
  // (C) 활동 관리 (세팅) 모달
  // --------------------------------------------------
  const handleOpenSettingModal = () => {
    if (!selectedMember) return;
    setIsSettingModalOpen(true);
  };

  const handleSaveActivityChanges = (updatedActivities: string[]) => {
    if (!selectedMember || !selectedMember.activities) return;

    // 현재 activeTab에 해당하는 부분만 업데이트
    const newActivities = { ...selectedMember.activities };
    if (activeTab === 'fetch') {
      newActivities.fetch = updatedActivities;
    } else if (activeTab === 'worktree') {
      newActivities.worktree = updatedActivities;
    } else if (activeTab === 'branch') {
      newActivities.branch = updatedActivities;
    } else if (activeTab === 'solution challenge') {
      newActivities.solutionChallenge = updatedActivities;
    }

    const updatedMember: MemberData = {
      ...selectedMember,
      activities: newActivities,
    };

    // members 교체
    const updatedList = members.map((m) =>
      m.name === updatedMember.name ? updatedMember : m
    );
    setMembers(updatedList);
    setSelectedMember(updatedMember);

    setIsSettingModalOpen(false);
  };

  return (
    <div className="admin-container">
      <div className="admin-content-wrapper">
        {/* 좌측 (검색 + 필터 + 테이블 + 페이지네이션) */}
        <div className="left-side">
          {/* 검색창 */}
          <div className="search-section">
            <input
              className="search-input"
              placeholder="검색하기"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 필터 버튼 */}
          <div className="filter-section">
            {['ALL', 'DevRel', 'Core', 'Member', 'Junior'].map((roleValue) => (
              <button
                key={roleValue}
                className={`filter-btn ${filterRole === roleValue ? 'active' : ''}`}
                onClick={() => {
                  setFilterRole(roleValue as typeof filterRole);
                  setCurrentPage(1);
                }}
              >
                {roleValue}
              </button>
            ))}
          </div>

          {/* 멤버 테이블 */}
          <table className="member-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>역할</th>
                <th>포지션</th>
                <th>포인트</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((m) => (
                <tr
                  key={m.name}
                  className={selectedMember?.name === m.name ? 'selected-row' : ''}
                  onClick={() => handleMemberClick(m)}
                >
                  <td>{m.name}</td>
                  <td>{m.role}</td>
                  <td>{m.position}</td>
                  <td>{m.points}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="pagination-row">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`page-btn ${p === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 우측 (선택된 멤버 상세) */}
        {selectedMember && (
          <div className="member-detail-section">
            <div className="detail-header">
              {/* 프로필 이미지 */}
              <Image
                src={
                  selectedMember.profileImageUrl && selectedMember.profileImageUrl.trim() !== ''
                    ? selectedMember.profileImageUrl
                    : '/profile.svg'
                }
                alt="프로필 이미지"
                className="manage-profile-image"
                width={120}
                height={120}
              />
              <h2>
                {selectedMember.name}
                <span className="edit-icon" onClick={handleEditIconClick}>
                  ✏️
                </span>
              </h2>
              <div className="detail-role">
                {selectedMember.position} / {selectedMember.role}
              </div>
              <div className="detail-point">
                <strong>{selectedMember.points}</strong> P
                <button className="point-edit-btn" onClick={handleOpenPointModal}>
                  포인트 수정
                </button>
              </div>
            </div>

            {/* 점수 수정 히스토리 */}
            <div className="score-history">
              <h3>점수 수정 히스토리</h3>
              <div className="score-history-table">
                <table>
                  <thead>
                    <tr>
                      <th>날짜</th>
                      <th>이름</th>
                      <th>역할</th>
                      <th>포인트 수정</th>
                      <th>사유</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMember.logs?.length ? (
                      selectedMember.logs.map((log, idx) => (
                        <tr key={idx}>
                          <td>{log.date}</td>
                          <td>{log.name}</td>
                          <td>{log.role}</td>
                          <td>
                            {log.pointChange > 0 ? `+${log.pointChange}` : `${log.pointChange}`}
                          </td>
                          <td>{log.reason}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center' }}>
                          기록이 없습니다
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 활동 관리 */}
            <div className="activity-manage">
              <h3>활동 관리</h3>
              <div className="tabs">
                {activityTabs.map((tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
                {/* 설정 아이콘 */}
                <button className="tab-setting-btn" onClick={handleOpenSettingModal}>
                  <Image src="/settingicon.svg" alt="설정" width={24} height={24} />
                </button>
              </div>
              <div className="tab-content">
                {activeTab === 'fetch' && (
                  <div className="activity-panel">
                    {selectedMember.activities?.fetch?.map((item, idx) => (
                      <p key={idx}>{item}</p>
                    ))}
                  </div>
                )}
                {activeTab === 'worktree' && (
                  <div className="activity-panel">
                    {selectedMember.activities?.worktree?.map((item, idx) => (
                      <p key={idx}>{item}</p>
                    ))}
                  </div>
                )}
                {activeTab === 'branch' && (
                  <div className="activity-panel">
                    {selectedMember.activities?.branch?.map((item, idx) => (
                      <p key={idx}>{item}</p>
                    ))}
                  </div>
                )}
                {activeTab === 'solution challenge' && (
                  <div className="activity-panel">
                    {selectedMember.activities?.solutionChallenge?.map((item, idx) => (
                      <p key={idx}>{item}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 (페이지 전체 하단) */}
      <div className="admin-bottom-buttons">
        <button className="admin-point-btn">멤버 포인트/활동 관리</button>
        <button className="admin-calendar-btn">캘린더 관리</button>
      </div>

      {/* (A) 회원정보 수정 모달 */}
      {selectedMember && (
        <ModalEditMember
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          member={selectedMember}
          onSave={handleSaveMemberChanges}
        />
      )}

      {/* (B) 포인트 수정 모달 */}
      {selectedMember && (
        <ModalEditPoint
          isOpen={isPointModalOpen}
          onClose={() => setIsPointModalOpen(false)}
          member={selectedMember}
          onSave={handleSavePointChanges}
        />
      )}

      {/* (C) 활동 관리 (세팅) 모달 */}
      {selectedMember && (
        <ModalActivitySetting
          isOpen={isSettingModalOpen}
          onClose={() => setIsSettingModalOpen(false)}
          activeTab={activeTab}
          member={selectedMember}
          onSave={handleSaveActivityChanges}
        />
      )}
    </div>
  );
}
