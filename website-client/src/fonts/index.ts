// src/fonts/index.ts
import localFont from 'next/font/local';

export const wantedSans = localFont({
  src: [
    {
      path: '../../public/fonts/static/WantedSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/static/WantedSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/static/WantedSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--wanted-sans', // 폰트를 담을 CSS 변수명
  display: 'swap',
});

export const wantedSansVariable = localFont({
  src: '../../public/fonts/variable/WantedSansVariable.woff2',
  weight: '100 900',  // 가변 폰트 범위
  style: 'normal',
  variable: '--wanted-sans-variable',
  display: 'swap',
  // font-variation-settings: 'wght' 400; 
  // -> next/font로 설정 시에는 기본값이 있으므로, 필요한 경우 추가
});
