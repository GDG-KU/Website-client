'use client';

import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './mypage.css';

interface PointHistoryItem {
  date: string;       // YYYY. MM. DD
  change: number;     // + or - 점수
  total: number;      // 누적 점수
  event: string;      // 어떤 이벤트/활동
}

export default function MyPage() {
  // -----------------------------
  // -----------------------------
  const [profileImageUrl, setProfileImageUrl] = useState<string>('/profile.svg'); 
  const [name, /*setName*/] = useState<string>('이정재');
  const [major, /*setMajor*/] = useState<string>('수학과 19학번');
  const [role, /*setRole*/] = useState<string>('AI / CORE'); // 예: "AI / CORE"
  const [joinDate, /*setJoinDate*/] = useState<string>('2024. 03. 22');
  
  const isCore = role.includes('CORE'); 
  const [totalPoint, /*setTotalPoint*/] = useState<number>(115); 
  const [pointHistory, /*setPointHistory*/] = useState<PointHistoryItem[]>([
    { date: '2024. 12. 05', change: -20, total: 240, event: 'worktree 분할' },
    { date: '2024. 11. 27', change: -20, total: 260, event: 'merge 참석' },
    { date: '2024. 11. 04', change: -3, total: 280, event: 'fetch 발표' },
    { date: '2024. 11. 01', change: -20, total: 260, event: 'worktree 분할' },
    { date: '2024. 09. 22', change: -20, total: 240, event: 'Hackathon 참석' },
    { date: '2024. 09. 22', change: -20, total: 260, event: '뒤풀이 참석' },
    { date: '2024. 09. 10', change: -20, total: 280, event: 'Hackathon 참석' },
    { date: '2024. 09. 07', change: -20, total: -20, event: 'worktree 분할' },
    { date: '2024. 08. 11', change: -20, total: 280, event: 'merge 참석' },
    { date: '2024. 08. 03', change: -20, total: -20, event: '뒤풀이 참석' },
    { date: '2024. 07. 17', change: -20, total: 260, event: '뒤풀이 참석' },
    { date: '2024. 07. 08', change: -3, total: 280, event: 'fetch 발표' },
    { date: '2024. 06. 01', change: -20, total: -20, event: 'Hackathon 참석' },
    { date: '2024. 05. 30', change: -3, total: 280, event: 'fetch 발표' },
  ]);

  const handleProfileImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // 미리보기용 로컬 URL
    const localUrl = URL.createObjectURL(file);
    setProfileImageUrl(localUrl);

    // 실제 업로드 로직: 백엔드에 전송 후, 응답으로 저장된 URL을 setProfileImageUrl()  
    //  :
    // const formData = new FormData();
    // formData.append('profileImage', file);
    // const res = await fetch('/api/upload-profile', {
    //   method: 'POST',
    //   body: formData,
    // });
    // const data = await res.json();
    // setProfileImageUrl(data.imageUrl);
  };

  // -----------------------------
  // 4) 렌더
  // -----------------------------
  return (
    <div className="mypage-container">
      {/* */}

      {/* 중앙 영역: 프로필 */}
      <section className="profile-section">
        <div className="profile-image-wrapper">
          <Image
            src={profileImageUrl}
            alt="프로필 사진"
            width={120}
            height={120}
            className="profile-image"
          />
          {/* 프로필 이미지 업로드 input */}
          <label htmlFor="profileUpload" className="upload-label">
            프로필 사진 변경
          </label>
          <input
            id="profileUpload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleProfileImageChange}
          />
        </div>

        <h2 className="profile-name">{name}</h2>
        <div className="profile-major">{major}</div>
        <div className="profile-role">{role}</div>
        <div className="profile-join-date">가입일: {joinDate}</div>

        {/* 버튼: 정보 수정 페이지 이동 */}
        <div className="profile-buttons">
          <Link href="/mypage/edit" className="edit-button">
            정보 수정
          </Link>
          {/* 관리자(core)만 접근 가능 */}
          {isCore && (
            <>
                <Link href="/admin">
                <button className="admin-button">관리자 모드</button>
                </Link>
                {/* 멤버 관리 → /admin/management */}
                <Link href="/admin/management">
                <button className="admin-button">
                    멤버 관리
                </button>
                </Link>
            </>
          )}
        </div>
      </section>

      {/* 오른쪽 영역: 포인트 + 포인트 히스토리 */}
      <section className="point-section">
        <h2 className="point-title">My Status</h2>
        <div className="point-total">
          {totalPoint}
          <span className="point-unit">P</span>
        </div>

        <div className="point-history-table">
          <table>
            <thead>
              <tr>
                <th>날짜</th>
                <th>변동</th>
                <th>누적</th>
                <th>이벤트</th>
              </tr>
            </thead>
            <tbody>
              {pointHistory.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.date}</td>
                  <td>{item.change}</td>
                  <td>{item.total}</td>
                  <td>{item.event}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
