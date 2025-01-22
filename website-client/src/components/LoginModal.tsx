'use client';

import React from 'react';
import Image from 'next/image';
import './LoginModal.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleGuestLogin = () => {
    onClose();
  };

  return (
    <div className="login-modal-backdrop">
      <div className="login-modal-container">
        <button className="login-modal-close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="login-modal-left">
          <Image
            src="/representative.svg"
            alt="대표 이미지"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="login-modal-right">
          <div className="modal-logo">
            <Image 
              src="/gdglogo.svg"
              alt="GDG on Campus Korea University 로고"
              width={156}
              height={28}
            />
          </div>
          <div className="button-group">
            <button
              type="button"
              className="google-btn"
              onClick={handleGoogleLogin}
            >
              <div className="google-logo">
                <Image
                  src="/googlelogo.svg"
                  alt="Google Logo"
                  width={17}
                  height={17}
                />
              </div>
              <span className="google-text">Google 로그인</span>
            </button>

            <button
              type="button"
              className="guest-btn"
              onClick={handleGuestLogin}
            >
              <div className="guest-logo">
            <Image
              src="/guestlogo.svg"
              alt="Guest Logo"
              width={17}
              height={17}
            />
            </div>
              <span className="guest-text">게스트로 접속하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
