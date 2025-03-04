'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface FaqData {
  id: number;
  question: string;
  answer: string;
}

export default function FaqManagementPage() {
  const [faqs, setFaqs] = useState<FaqData[]>([]);
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');

  // FAQ 전체 조회
  useEffect(() => {
    // 실제 GET /faq
    // fetch('/faq')
    //   .then((res) => res.json())
    //   .then((data) => setFaqs(data))
    //   .catch(err => console.error(err));

    // 임시 mock
    setFaqs([
      {
        id: 1,
        question: 'NestJS란 무엇인가요?',
        answer:
          'NestJS는 효율적이고 확장 가능한 Node.js 서버사이드 애플리케이션 프레임워크입니다.',
      },
      {
        id: 2,
        question: 'React와 Next.js의 차이는 무엇인가요?',
        answer:
          'React는 UI 라이브러리, Next.js는 React 기반의 프레임워크로 SSR/라우팅 등을 제공합니다.',
      },
    ]);
  }, []);

  const handleCreateFaq = async () => {
    if (!newQ.trim() || !newA.trim()) {
      alert('질문과 답변을 모두 입력하세요');
      return;
    }
    // 실제 POST /faq
    /*
    const body = { user_id: 1, question: newQ, answer: newA };
    const res = await fetch('/faq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      // 목록 갱신
    }
    */
    // 임시 mock
    const newFaq: FaqData = {
      id: Math.floor(Math.random() * 100000),
      question: newQ,
      answer: newA,
    };
    setFaqs([...faqs, newFaq]);
    setNewQ('');
    setNewA('');
  };

  const handleDeleteFaq = async (id: number) => {
    // 실제 DELETE /faq/{id}
    /*
    const res = await fetch(`/faq/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setFaqs(prev => prev.filter(f => f.id !== id));
    }
    */
    // 임시 mock
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>FAQ 관리</h1>

      <div style={{ margin: '1rem 0' }}>
        <input
          placeholder="질문"
          value={newQ}
          onChange={(e) => setNewQ(e.target.value)}
        />
        <input
          placeholder="답변"
          value={newA}
          onChange={(e) => setNewA(e.target.value)}
        />
        <button onClick={handleCreateFaq}>등록</button>
      </div>

      <ul>
        {faqs.map((f) => (
          <li key={f.id} style={{ marginBottom: '1rem' }}>
            <strong>Q: {f.question}</strong>
            <br />
            A: {f.answer}
            <br />
            <button onClick={() => handleDeleteFaq(f.id)}>삭제</button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '2rem' }}>
        <Link href="/admin/management">
          <button>멤버 포인트/활동 관리</button>
        </Link>
        <Link href="/admin/calendar">
          <button>캘린더 관리</button>
        </Link>
        <Link href="/admin/faq">
          <button>FAQ 관리</button>
        </Link>
        <Link href="/admin/role">
          <button>Role/Authority 관리</button>
        </Link>
      </div>
    </div>
  );
}
