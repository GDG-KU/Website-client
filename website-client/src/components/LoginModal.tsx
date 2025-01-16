'use client';

import React, { useState, useEffect  } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginAsync } from '@/store/loginSlice';
import './LoginModal.css';
import Image from 'next/image';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.login);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [saveId, setSaveId] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedUsername = localStorage.getItem('savedUsername');
      if (storedUsername) {
        setUsername(storedUsername);
        setSaveId(true);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resultAction = await dispatch(loginAsync({ username, password }));
    if (loginAsync.fulfilled.match(resultAction)) {
      if (saveId) {
        localStorage.setItem('savedUsername', username);
      } else {
        localStorage.removeItem('savedUsername');
      }
    onClose();
    }
  };

  const handleGoogleLogin = () => {
    // 구글 로그인 로직
    alert('구글 로그인 시도');
  };

  return (
    <div className="login-modal-backdrop">
      <div className="login-modal-container">
        {/* 닫기 버튼 */}
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
          {/* 로고 (우측 상단) */}
          <div className="modal-logo">
            <Image 
              src="/logo.png"
              alt="GDG on Campus Korea University 로고"
              width={120}
              height={40}
            />
          </div>

          <h2 className="welcome-text">Welcome!</h2>
          <form onSubmit={handleSubmit} className="login-form">
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
