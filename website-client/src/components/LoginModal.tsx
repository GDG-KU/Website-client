'use client';

import React from 'react';
import Image from 'next/image';
import styles from './LoginModal.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    if (!API_BASE_URL) {
      console.error('API_BASE_URL가 설정되어 있지 않습니다.');
      return;
    }
    console.log('[LoginModal] Google 로그인 버튼 클릭');
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleGuestLogin = () => {
    console.log('[LoginModal] 게스트로 접속하기');
    onClose();
  };

  return (
    <div className={styles.loginModalBackdrop}>
      <div className={styles.loginModalContainer}>
        <button className={styles.loginModalCloseBtn} onClick={onClose}>
          ✕
        </button>
        <div className={styles.loginModalLeft}>
          <Image
            src="/representative.svg"
            alt="대표 이미지"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className={styles.loginModalRight}>
          <div className={styles.modalLogo}>
            <Image
              src="/gdglogo.svg"
              alt="GDG on Campus Korea University 로고"
              width={156}
              height={28}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              className={styles.googleBtn} 
              onClick={handleGoogleLogin}>
              <div className={styles.googleLogo}>
                <Image
                  src="/googlelogo.svg" 
                  alt="Google Logo" 
                  width={17} 
                  height={17}
                />
              </div>
              <span className={styles.googleText}>Google 로그인</span>
            </button>
            <button 
              type="button" 
              className={styles.guestBtn} 
              onClick={handleGuestLogin}>
              <div className={styles.guestLogo}>
                <Image 
                  src="/guestlogo.svg" 
                  alt="Guest Logo" 
                  width={17} 
                  height={17}
                />
              </div>
              <span className={styles.guestText}>게스트로 접속하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
