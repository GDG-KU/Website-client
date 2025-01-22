'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Next.js 13+
import './mypageEdit.css';

interface ProfileResponse {
  nickname: string;
  department: string;
  student_number: string;
  position_names: string[]; // ["BE","AI"]
}

export default function Page() {
  const router = useRouter();

  // 폼 상태
  const [nickname, setNickname] = useState('');
  const [department, setDepartment] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [positionNames, setPositionNames] = useState<string>(''); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/mypage/profile');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data: ProfileResponse = await res.json();

        // 폼에 기존 값 세팅
        setNickname(data.nickname);
        setDepartment(data.department);
        setStudentNumber(data.student_number);
        setPositionNames(data.position_names.join(', ')); 
        // 예) ["BE","AI"] → "BE, AI"
      } catch (err) {
        console.error('프로필 불러오기 실패:', err);
      }
    };
    fetchProfile();
  }, []);

  // 폼 제출
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // position_names: 문자열 → 배열
    const positionsArray = positionNames
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p !== ''); // 빈문자 제거

    // PUT /mypage/profile
    try {
      const res = await fetch('/mypage/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname,
          department,
          student_number: studentNumber,
          position_names: positionsArray,
        }),
      });

      if (!res.ok) {
        console.error('프로필 수정 실패');
        return;
      }

      console.log('프로필 수정 성공');
      router.push('/mypage');
    } catch (err) {
      console.error('프로필 수정 에러:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Profile</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          닉네임
          <input
            className={styles.input}
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
          />
        </label>

        <label className={styles.label}>
          학과
          <input
            className={styles.input}
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="예) 컴퓨터학과"
          />
        </label>

        <label className={styles.label}>
          학번
          <input
            className={styles.input}
            type="text"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            placeholder="예) 20231234"
          />
        </label>

        <label className={styles.label}>
          포지션(쉼표로 구분)
          <input
            className={styles.input}
            type="text"
            value={positionNames}
            onChange={(e) => setPositionNames(e.target.value)}
            placeholder="예) BE, AI"
          />
        </label>

        <button type="submit" className={styles.saveButton}>
          저장
        </button>
      </form>
    </div>
  );
}
