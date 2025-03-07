'use client';

import React, { useEffect, useState } from 'react';
import styles from './faqManagement.module.css';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const fallbackFAQs: FAQItem[] = [
  {
    id: 101,
    question: 'Fallback Q1',
    answer: '백엔드 연결 실패 시 보여줄 예시 FAQ입니다.',
  },
  {
    id: 102,
    question: 'Fallback Q2',
    answer: '이 FAQ 또한 백엔드 연결이 되지 않을 때 표시됩니다.',
  },
];

export default function FAQManagementPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // FAQ 추가 모달 상태
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  // FAQ 수정/삭제 모달 상태
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalFAQ, setModalFAQ] = useState<FAQItem | null>(null);
  const [modalQuestion, setModalQuestion] = useState('');
  const [modalAnswer, setModalAnswer] = useState('');

  // FAQ 전체 조회
  const fetchAllFAQs = async () => {
    try {
      const res = await fetch('/faq', { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch FAQs');
      const data: FAQItem[] = await res.json();
      setFaqs(data);
    } catch (error) {
      console.error('FAQ 전체 조회 실패:', error);
      setFaqs(fallbackFAQs);
    }
  };

  // FAQ 생성
  const createFAQ = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      alert('질문과 답변을 모두 입력하세요.');
      return;
    }
    try {
      const body = {
        user_id: 1, // 실제 사용자 ID로 대체
        question: newQuestion,
        answer: newAnswer,
      };
      const res = await fetch('/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to create FAQ');
      await fetchAllFAQs();
      setNewQuestion('');
      setNewAnswer('');
      setAddModalOpen(false);
    } catch (error) {
      console.error('FAQ 생성 실패:', error);
    }
  };

  // FAQ 삭제
  const deleteFAQ = async (id: number) => {
    try {
      const res = await fetch(`/faq/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete FAQ');
      await fetchAllFAQs();
    } catch (error) {
      console.error('FAQ 삭제 실패:', error);
    }
  };

  // 수정 모달 열기 (행 클릭 시)
  const openEditModal = (faq: FAQItem) => {
    setModalFAQ(faq);
    setModalQuestion(faq.question);
    setModalAnswer(faq.answer);
    setEditModalOpen(true);
  };

  // FAQ 수정 (수정 모달에서 "수정" 클릭)
  const updateFAQ = async () => {
    if (!modalFAQ) return;
    if (!modalQuestion.trim() || !modalAnswer.trim()) {
      alert('질문과 답변을 모두 입력하세요.');
      return;
    }
    try {
      const body = {
        question: modalQuestion,
        answer: modalAnswer,
      };
      const res = await fetch(`/faq/${modalFAQ.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to update FAQ');
      await fetchAllFAQs();
      closeEditModal();
    } catch (error) {
      console.error('FAQ 수정 실패:', error);
    }
  };

  // 모달 닫기 함수들
  const closeEditModal = () => {
    setEditModalOpen(false);
    setModalFAQ(null);
    setModalQuestion('');
    setModalAnswer('');
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setNewQuestion('');
    setNewAnswer('');
  };

  useEffect(() => {
    fetchAllFAQs();
  }, []);

  return (
    <div className={styles.faqContainer}>
      <h1 className={styles.pageTitle}>FAQ 관리</h1>

      {/* FAQ 추가하기 버튼 */}
      <div className={styles.faqTopBar}>
        <button
          className={styles.addFaqButton}
          onClick={() => setAddModalOpen(true)}
        >
          FAQ 추가하기
        </button>
      </div>

      {/* FAQ 목록 테이블 (ID 열 및 액션 열 제거) */}
      <table className={styles.faqTable}>
        <thead>
          <tr>
            <th>질문</th>
            <th>답변</th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((faq) => (
            <tr
              key={faq.id}
              onClick={() => openEditModal(faq)}
              style={{ cursor: 'pointer' }}
            >
              <td>{faq.question}</td>
              <td>
                <div className={styles.faqAnswer}>{faq.answer}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FAQ 추가 모달 */}
      {addModalOpen && (
        <div className={styles.modalOverlay} onClick={closeAddModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={closeAddModal}
            >
              ×
            </button>
            <h2>FAQ 추가</h2>
            <div className={styles.modalRow}>
              <label className={styles.formLabel}>질문</label>
              <input
                className={styles.formInput}
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
            </div>
            <div className={styles.modalRow}>
              <label className={styles.formLabel}>답변</label>
              <textarea
                className={styles.formTextarea}
                rows={3}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
            </div>
            <div className={styles.modalButtons}>
              <button
                className={styles.saveButton}
                onClick={createFAQ}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ 수정/삭제 모달 */}
      {editModalOpen && modalFAQ && (
        <div className={styles.modalOverlay} onClick={closeEditModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={closeEditModal}
            >
              ×
            </button>
            <h2>FAQ 수정 / 삭제</h2>
            <div className={styles.modalRow}>
              <label className={styles.formLabel}>질문</label>
              <input
                className={styles.formInput}
                type="text"
                value={modalQuestion}
                onChange={(e) => setModalQuestion(e.target.value)}
              />
            </div>
            <div className={styles.modalRow}>
              <label className={styles.formLabel}>답변</label>
              <textarea
                className={styles.formTextarea}
                rows={3}
                value={modalAnswer}
                onChange={(e) => setModalAnswer(e.target.value)}
              />
            </div>
            <div className={styles.modalButtons}>
              <button
                className={styles.updateButton}
                onClick={updateFAQ}
              >
                수정
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => {
                  deleteFAQ(modalFAQ.id);
                  closeEditModal();
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
