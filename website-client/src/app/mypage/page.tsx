'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { fetchWithAuth } from '@/utils/fetchWrapper'; // 위에서 작성한 fetchWrapper
import './mypage.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface HistoryResponseItem {
  id: number;
  point_change: number;
  role: string;
  reason: string;
  date: string; // "YYYY-MM-DD"
}

interface ProfileResponse {
  nickname: string;
  role: string;
  email: string;
  department: string;
  student_number: string;
  position_names: string[];
  profile_image: string;
  join_date: string; // "YYYY-MM-DD"
}

/** 화면에 표시할 때 쓸 포인트 히스토리 구조 */
interface PointHistoryItem {
  date: string;    // YYYY. MM. DD
  change: number;  // point_change
  total: number;   // 누적 점수
  event: string;   // reason
}

export default function MyPage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string>('/profile.svg');
  const [name, setName] = useState<string>('');       
  const [major, setMajor] = useState<string>('');      // "Computer Science 20231234학번"
  const [role, setRole] = useState<string>('');        // "Organizer / Junior / BE / AI"
  const [joinDate, setJoinDate] = useState<string>(''); // "2025. 01. 16"
  const [isCore, setIsCore] = useState<boolean>(false); // 관리자 모드 노출 여부

  // 누적 포인트
  const [totalPoint, setTotalPoint] = useState<number>(0);

  // 서버에서 불러온 포인트 히스토리
  const [pointHistory, setPointHistory] = useState<PointHistoryItem[]>([]);

  useEffect(() => {
    /** "YYYY-MM-DD" → "YYYY. MM. DD" 형태로 변환 */
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const [year, month, day] = dateString.split('-');
      return `${year}. ${month}. ${day}`;
    };

    /** 프로필 조회 */
    const fetchProfile = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/mypage/profile`, {
          method: 'GET',
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data: ProfileResponse = await res.json();

        // 프로필 정보 상태에 저장
        setProfileImageUrl(data.profile_image || '/profile.svg');
        setName(data.nickname);

        // 학과+학번
        setMajor(`${data.department} ${data.student_number}학번`);

        // role + position_names를 슬래시(/)로 연결
        const positionsJoined = data.position_names.join(' / ');
        const combinedRole = positionsJoined
          ? `${data.role} / ${positionsJoined}`
          : data.role;
        setRole(combinedRole);

        // 가입일 YYYY. MM. DD 형태로 변환
        setJoinDate(formatDate(data.join_date));

        // 관리자 여부 판단 (role 문자열에 Organizer, CORE 등이 포함된 경우)
        setIsCore(
          combinedRole.includes('Organizer') ||
          combinedRole.includes('CORE') ||
          combinedRole.includes('Admin')
        );
      } catch (error) {
        console.error('프로필 조회 실패:', error);
      }
    };

    /** 포인트 히스토리 조회 */
    const fetchHistory = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/mypage/history`, {
          method: 'GET',
        });
        if (!res.ok) throw new Error('Failed to fetch history');
        const data: HistoryResponseItem[] = await res.json();

        // 누적 포인트 계산
        let cumulative = 0;
        const mapped = data.map((item) => {
          cumulative += item.point_change;
          return {
            date: formatDate(item.date),
            change: item.point_change,
            total: cumulative,
            event: item.reason,
          };
        });

        setPointHistory(mapped);
        if (mapped.length > 0) {
          setTotalPoint(mapped[mapped.length - 1].total);
        } else {
          setTotalPoint(0);
        }
      } catch (error) {
        console.error('포인트 히스토리 조회 실패:', error);
      }
    };

    // 초기 로드 시 두 API를 모두 호출
    fetchProfile();
    fetchHistory();
  }, []);

  const handleProfileImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // 미리보기(프론트)
    const localUrl = URL.createObjectURL(file);
    setProfileImageUrl(localUrl);

    // 실제 업로드: FormData 사용
    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/mypage/profile-image`, {
        method: 'POST',
        body: formData, 
        // headers는 fetchWithAuth 내부 로직에 의해 FormData면 별도 Content-Type 설정 안 함
      });

      if (!res.ok) {
        console.error('프로필 이미지 업로드 실패');
        return;
      }
      const data = await res.json();
      if (data?.imageUrl) {
        setProfileImageUrl(data.imageUrl);
      }
    } catch (err) {
      console.error('프로필 이미지 업로드 에러:', err);
    }
  };

  // -----------------------------
  const handleUpdateProfile = async () => {
    // nickname, department, student_number, position_names 등을 PUT
    const body = {
      nickname: name,
      department: major.split(' ')[0],         // "Computer"
      student_number: major.split(' ')[1]?.replace('학번', ''), // "20231234"
      position_names: role.split('/').map(v => v.trim()),       // ["Organizer", "Junior", ...]
    };

    try {
      const res = await fetchWithAuth('/mypage/profile', {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        console.error('프로필 정보 수정 실패');
        return;
      }
      console.log('프로필 수정 성공');
    } catch (err) {
      console.error('프로필 정보 수정 에러:', err);
    }
  };

  return (
    <div className="mypage-container">
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

        <div className="profile-buttons">
          <button onClick={handleUpdateProfile} className="edit-button">
            정보 수정
          </button>
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
