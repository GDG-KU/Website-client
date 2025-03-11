'use client';

import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { fetchWithAuth } from '@/utils/fetchWithAuth';
import styles from './mypage.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface HistoryResponseItem {
  id: number;
  point_change: number;
  role: string;
  reason: string;
  date: string;
  is_deleted: boolean;
}

interface ProfileResponse {
  id: number;
  nickname: string;
  role: string;
  email: string;
  department: string;
  student_number: string;
  position_names: string[];
  profile_image: string;
  join_date: string; // "YYYY-MM-DD"
}

interface PointHistoryItem {
  date: string;
  change: number;
  total: number;
  event: string;
}

export default function MyPage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string>('/profile.svg');
  const [name, setName] = useState<string>('');
  const [major, setMajor] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [joinDate, setJoinDate] = useState<string>('');
  const [isCore, setIsCore] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [totalPoint, setTotalPoint] = useState<number>(0);
  const [pointHistory, setPointHistory] = useState<PointHistoryItem[]>([]);
  const [profilePositions, setProfilePositions] = useState<string[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [modalNickname, setModalNickname] = useState('');
  const [modalDepartment, setModalDepartment] = useState('');
  const [modalStudentNumber, setModalStudentNumber] = useState('');
  const [modalPositionNames, setModalPositionNames] = useState('');

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${year}. ${month}. ${day}`;
  };

  const fetchProfileImage = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/mypage/profile/image`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('프로필 이미지 URL 조회 실패');
      const imageUrl: string = await res.json();
      setProfileImageUrl(imageUrl || '/profile.svg');
    } catch (error) {
      console.error('프로필 이미지 URL 조회 실패:', error);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/mypage/profile`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('프로필 조회 실패');
      const data: ProfileResponse = await res.json();

      setName(data.nickname);
      setMajor(`${data.department} ${data.student_number}학번`);
      setProfilePositions(data.position_names);

      const positionsJoined = data.position_names.join(' / ');
      const combinedRole = positionsJoined ? `${data.role} / ${positionsJoined}` : data.role;
      setRole(combinedRole);

      setJoinDate(formatDate(data.join_date));
      setIsCore(
        combinedRole.includes('Organizer') ||
        combinedRole.includes('Core') ||
        combinedRole.includes('Admin')
      );
      setUserId(data.id);

      fetchProfileImage();
    } catch (error) {
      console.error('프로필 조회 실패:', error);
    }
  }, [fetchProfileImage]);

  const fetchPointHistory = useCallback(async () => {
    if (userId === null) return;
    try {
      const queryRole = role.includes(' / ') ? role.split(' / ')[0].trim() : role;
      const res = await fetchWithAuth(
        `${API_BASE_URL}/point/history/${userId}?role=${encodeURIComponent(queryRole)}`,
        { method: 'GET' }
      );
      if (!res.ok) throw new Error('포인트 히스토리 조회 실패');
      const data: HistoryResponseItem[] = await res.json();

      const sortedData = data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      let runningTotal = 0;
      const mappedAsc = sortedData.map((item) => {
        runningTotal += item.point_change;
        return {
          date: formatDate(item.date),
          change: item.point_change,
          total: runningTotal,
          event: item.reason,
        };
      });

      setTotalPoint(runningTotal);

      const mappedDesc = [...mappedAsc].reverse();

      setPointHistory(mappedDesc);
    } catch (error) {
      console.error('포인트 히스토리 조회 실패:', error);
    }
  }, [userId, role]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (userId !== null) {
      fetchPointHistory();
    }
  }, [userId, fetchPointHistory]);

  const handleProfileImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
  
    const localUrl = URL.createObjectURL(file);
    setProfileImageUrl(localUrl);
  
    try {
      const signedUrlRes = await fetchWithAuth(`${API_BASE_URL}/mypage/signedurl`, {
        method: 'GET',
      });
      if (!signedUrlRes.ok) throw new Error('서명된 URL 생성 실패');
      const signedUrlData = await signedUrlRes.json();
      const uploadUrl = signedUrlData.signedurl;
  
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });
      if (!uploadRes.ok) throw new Error('파일 업로드 실패');
  
      const imageUrl = uploadUrl.split('?')[0];
  
      const patchRes = await fetchWithAuth(`${API_BASE_URL}/mypage/profile/image`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl }),
      });
      if (!patchRes.ok) throw new Error('프로필 이미지 업로드 최종 갱신 실패');
  
      const newImageUrl = await patchRes.json();
      setProfileImageUrl(newImageUrl);
    } catch (err) {
      console.error('프로필 이미지 업로드 에러:', err);
    }
  };

  const handleDeleteProfileImage = async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/mypage/profile/image`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('프로필 이미지 삭제 실패');
      setProfileImageUrl('/profile.svg');
      console.log('프로필 이미지 삭제 성공');
    } catch (error) {
      console.error('프로필 이미지 삭제 에러:', error);
    }
  };

  const openModal = () => {
    setModalNickname(name);
    const majorArr = major.split(' ');
    setModalDepartment(majorArr[0] || '');
    setModalStudentNumber(majorArr[1] ? majorArr[1].replace('학번', '') : '');
    setModalPositionNames(profilePositions.join(', '));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSaveProfile = async () => {
    const body = {
      nickname: modalNickname,
      department: modalDepartment,
      student_number: modalStudentNumber,
      position_names: modalPositionNames
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v !== ''),
    };

    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/mypage/profile`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        console.error('프로필 정보 수정 실패');
        return;
      }
      console.log('프로필 정보 수정 성공');
      setName(modalNickname);
      setMajor(`${modalDepartment} ${modalStudentNumber}학번`);
      setProfilePositions(body.position_names);
      setRole(body.position_names.length > 0 ? body.position_names.join(' / ') : '');
      setShowModal(false);
    } catch (err) {
      console.error('프로필 정보 수정 에러:', err);
    }
  };

  return (
    <div className={styles['mypage-container']}>
      <section className={styles['profile-section']}>
        <div className={styles['profile-image-wrapper']}>
          <Image
            src={profileImageUrl}
            alt="프로필 사진"
            width={120}
            height={120}
            className={styles['profile-image']}
          />
          <label htmlFor="profileUpload" className={styles['upload-label']}>
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

        <h2 className={styles['profile-name']}>{name}</h2>
        <div className={styles['profile-major']}>{major}</div>
        <div className={styles['profile-role']}>{role}</div>
        <div className={styles['profile-join-date']}>가입일: {joinDate}</div>

        <div className={styles['profile-buttons']}>
          <button onClick={openModal} className={styles['edit-button']}>
            정보 수정
          </button>
          {isCore && (
            <Link href="/admin">
              <button className={styles['admin-button']}>관리자 모드</button>
            </Link>
          )}
        </div>
      </section>
      <section className={styles['point-section']}>
        <h2 className={styles['point-title']}>My Status</h2>
        <div className={styles['point-total']}>
          {totalPoint}
          <span className={styles['point-unit']}>P</span>
        </div>

        <div className={styles['point-history-table']}>
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

      {showModal && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal']}>
            <h2 className={styles['modal-title']}>프로필 정보 수정</h2>
            <div className={styles['modal-content']}>
              <label>닉네임</label>
              <input
                type="text"
                value={modalNickname}
                onChange={(e) => setModalNickname(e.target.value)}
              />
              <label>학과</label>
              <input
                type="text"
                value={modalDepartment}
                onChange={(e) => setModalDepartment(e.target.value)}
              />
              <label>학번</label>
              <input
                type="text"
                value={modalStudentNumber}
                onChange={(e) => setModalStudentNumber(e.target.value)}
              />
              <label>Position</label>
              <input
                type="text"
                value={modalPositionNames}
                onChange={(e) => setModalPositionNames(e.target.value)}
              />
            </div>
            <div className={styles['modal-actions']}>
              <button onClick={handleDeleteProfileImage} className={styles['delete-button']}>
                프로필 이미지 삭제
              </button>
              <button onClick={handleSaveProfile} className={styles['save-button']}>
                저장
              </button>
              <button onClick={closeModal} className={styles['cancel-button']}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
