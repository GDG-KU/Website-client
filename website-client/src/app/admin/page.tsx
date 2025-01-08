'use client';

import React, { useState, useMemo, useEffect } from 'react';
import './admin.css';

interface MemberData {
  name: string;        
  role: 'Core' | 'DevRel' | 'Member' | 'Junior';
  position: 'FE' | 'BE' | 'AI' | 'DSGN' | 'DevRel';
  points: number;
  logs?: Array<{
    date: string;          
    name: string;         
    role: string;         
    pointChange: number;  
    reason: string;       
  }>;
}

// 활동 관리 탭
const activityTabs = ['fetch', 'worktree', 'branch', 'solution challenge'];

export default function AdminPage() {
  // 1) 멤버 데이터 상태
  const [members, setMembers] = useState<MemberData[]>([]);

  // 2) 검색어, 필터, 페이지네이션, 선택된 멤버, 탭 등
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] =
    useState<'ALL' | 'DevRel' | 'Core' | 'Member' | 'Junior'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('fetch');

  // 3) 백엔드에서 멤버 목록을 받아와야함
  useEffect(() => {
    // fetch('/api/members')
    //   .then((res) => res.json())
    //   .then((data: MemberData[]) => setMembers(data))
    //   .catch((err) => console.error('멤버 데이터 불러오기 실패:', err));

    // 일단은 데모용 Mock 데이터
    const mockData: MemberData[] = [
      { name: '김성훈', role: 'Member', position: 'AI', points: 80 },
      { name: '김도연', role: 'Core', position: 'BE', points: 120 },
      { name: '김서훈', role: 'Core', position: 'DSGN', points: 85 },
      { name: '김민재', role: 'Member', position: 'DSGN', points: 115 },
      { name: '김유진', role: 'Member', position: 'AI', points: 110 },
      { name: '김하빈', role: 'Core', position: 'DevRel', points: 90 },
      { name: '나을솔', role: 'Member', position: 'DSGN', points: 115 },
      {
        name: '도지훈', role: 'Core', position: 'FE', points: 120,
        logs: [
          { date: '2024. 11. 24', name: '도지훈', role: 'CORE', pointChange: -3, reason: 'worktree 분할' },
          { date: '2024. 11. 17', name: '도지훈', role: 'CORE', pointChange: +5, reason: 'Hackathon 참석' },
          { date: '2024. 09. 03', name: '도지훈', role: 'CORE', pointChange: +5, reason: 'merge 참석' },
          { date: '2024. 07. 11', name: '도지훈', role: 'CORE', pointChange: -2, reason: 'fetch 발표' },
        ]
      },
      { name: '도세린', role: 'Member', position: 'BE', points: 100 },
      { name: '박주원', role: 'Member', position: 'DSGN', points: 110 },
      { name: '박세영', role: 'Core', position: 'FE', points: 125 },
      { name: '박재하', role: 'Member', position: 'BE', points: 75 },
      { name: '이리서', role: 'Core', position: 'FE', points: 60 },
      { name: '이가윤', role: 'Member', position: 'FE', points: 135 },
      { name: '정민서', role: 'Member', position: 'BE', points: 115 },
    ];
    setMembers(mockData);
  }, []);

  // 4) 검색 + 필터
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

  // 5) 페이지네이션
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // 멤버 클릭 → 상세
  const handleMemberClick = (member: MemberData) => {
    setSelectedMember(member);
  };

  return (
    <div className="admin-container">
      <div className="admin-content-wrapper">
        {/* 왼쪽: 검색창 위, 그 아래 필터 버튼, 그 아래 멤버 목록 & 페이지네이션 */}
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
                  setCurrentPage(1); // 필터 변경 시 페이지를 1로 리셋
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

        {/* 오른쪽: 선택된 멤버 상세 */}
        {selectedMember && (
          <div className="member-detail-section">
            <div className="detail-header">
              <h2>
                {selectedMember.name}
                <span className="edit-icon">✏️</span>
              </h2>
              <div className="detail-major">컴퓨터학과 22학번</div>
              <div className="detail-role">
                {selectedMember.position} / {selectedMember.role}
              </div>
              <div className="detail-point">
                <strong>{selectedMember.points}</strong> P
                <button className="point-edit-btn">포인트 수정</button>
              </div>
            </div>

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
                <button className="tab-setting-btn">⚙</button>
              </div>
              <div className="tab-content">
                {activeTab === 'fetch' && (
                  <div className="activity-panel">
                    <p>Website</p>
                    <p>Design System</p>
                    <p>History</p>
                    <p>Goody Project</p>
                    <p>팀별 프로젝트</p>
                    <button className="save-btn">저장</button>
                  </div>
                )}
                {activeTab === 'worktree' && (
                  <div className="activity-panel">
                    <p>Worktree 관련 프로젝트 목록...</p>
                  </div>
                )}
                {activeTab === 'branch' && (
                  <div className="activity-panel">
                    <p>Branch 관련 프로젝트 목록...</p>
                  </div>
                )}
                {activeTab === 'solution challenge' && (
                  <div className="activity-panel">
                    <p>Solution Challenge 진행 내역...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼은 필요 시 따로 여기에 배치 가능 */}
      <div className="admin-bottom-buttons">
        <button className="admin-point-btn">멤버 포인트/활동 관리</button>
        <button className="admin-calendar-btn">캘린더 관리</button>
      </div>
    </div>
  );
}
