/*app/page.tsx*/
import { redirect } from 'next/navigation';

export default function Home() {
  // 홈(/)으로 접근하면 즉시 /aboutus/calendar로 리다이렉트
  redirect('/aboutus/calendar');
  return null; // 혹은 빈 JSX 반환
}