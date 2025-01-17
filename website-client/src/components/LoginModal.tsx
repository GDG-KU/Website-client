'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
// import { useAppSelector } from '@/store/hooks';
import { normalLoginAsync } from '@/store/authSlice';

import Image from 'next/image';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const dispatch = useAppDispatch();
  // const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [saveId, setSaveId] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('savedUsername');
      if (saved) {
        setUsername(saved);
        setSaveId(true);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 일반 로그인
  const handleNormalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(normalLoginAsync({ username, password }));
    if (normalLoginAsync.fulfilled.match(result)) {
      if (saveId) {
        localStorage.setItem('savedUsername', username);
      } else {
        localStorage.removeItem('savedUsername');
      }
      //console.log('일반 로그인 성공, token=', result.payload);
      onClose();
    }
  };

  //auth/google 로 이동
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  /*
  const handleGoogleCallback = async () => {
    const result = await dispatch(googleCallbackAsync());
    if (googleCallbackAsync.fulfilled.match(result)) {
      alert('구글 로그인 성공');
      console.log('구글 OAuth 토큰 =', result.payload);
      onClose();
    }
  };

  // 토큰 재발급
  const handleRefresh = async () => {
    if (!refreshToken) {
      alert('No refresh token');
      return;
    }
    const result = await dispatch(refreshTokenAsync(refreshToken));
    if (refreshTokenAsync.fulfilled.match(result)) {
      alert('Token 재발급 성공');
      console.log('refresh new tokens =', result.payload);
    }
  };

  // 로그아웃
  const handleLogout = () => {
    dispatch(logout());
    alert('로그아웃 되었습니다.');
  };
  */
  return (
    <div className="login-modal-backdrop">
      <div className="login-modal-container">
        <button className="login-modal-close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="login-modal-left">
          <Image
            src="/representative.jpg"
            alt="대표 이미지"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="login-modal-right">
          <div className="modal-logo">
            <Image 
              src="/logo.png"
              alt="GDG on Campus Korea University 로고"
              width={120}
              height={40}
            />
          </div>

          <h2 className="welcome-text">Welcome!</h2>
          <form onSubmit={handleNormalLogin} className="login-form">
            <input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* 아이디 저장 체크박스 
            <label className="save-id-row">
                <input
                    type="checkbox"
                    checked={saveId}
                    onChange={(e) => setSaveId(e.target.checked)}
                    className="save-id-checkbox"
                />
                <span className="save-id-text">아이디 저장하기</span>
            </label>
            */}
            {/* 로그인 버튼 */}
            <button type="submit" className="login-btn">
              로그인
            </button>

            {/* 구글 로그인 버튼 */}
            <button
                type="button"
                className="google-btn"
                onClick={handleGoogleLogin}
            >
            <div className="google-logo">
                <Image
                src="/googlelogo.svg"
                alt="Google Logo"
                width={18}
                height={18}
                />
            </div>
            <span className="google-text">Google 로그인</span>
            </button>
          </form>

          <div className="bottom-links">
            <a href="/find-id">아이디 찾기</a> |{" "}
            <a href="/find-password">비밀번호 찾기</a> |{" "}
            <a href="/signup">회원가입</a>
          </div>
        </div>
      </div>
    </div>
  );
}
