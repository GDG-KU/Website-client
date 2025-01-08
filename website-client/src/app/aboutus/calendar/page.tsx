'use client';
import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import Image from 'next/image';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';
import ActivityModal from '@/components/ActivityModal';

// 일정(활동) 정보를 나타내는 인터페이스
interface ActivityItem {
  id: string;
  title: string;        // 일정 제목
  startDate: string;    // YYYY-MM-DD (이벤트 시작 날짜)
  endDate: string;      // YYYY-MM-DD (이벤트 종료 날짜)
  category: string;     // 일정 종류 (branch, fetch, demo 등)
  startTime?: string;
  endTime?: string;
  description?: string;
  participants?: string[];
}

// 날짜가 startDate~endDate 범위에 포함되는지 확인하는 함수
function isDateInRange(dateObj: Date, startStr: string, endStr: string): boolean {
  const dateTime = dateObj.getTime();
  const startTime = new Date(startStr).getTime();
  const endTime = new Date(endStr).getTime();
  return startTime <= dateTime && dateTime <= endTime;
}

// 데모용 일정들
const sampleActivities: ActivityItem[] = [
  {
    id: '1',
    title: 'branch/ai/WK3',
    startDate: '2024-12-03',
    endDate: '2024-12-03',  // 당일 일정
    category: 'branch',
    startTime: '19:00',
    endTime: '20:00',
    description: 'branch AI weekly 3차 모임',
    participants: ['userA', 'userB'],
  },
  {
    id: '2',
    title: 'fetch/be/WK2',
    startDate: '2024-12-05',
    endDate: '2024-12-05',
    category: 'fetch',
    startTime: '14:00',
    endTime: '15:30',
    description: 'fetch backend weekly 2차 모임',
    participants: ['userA', 'userB'],
  },
  {
    id: '3',
    title: 'Demo Day',
    startDate: '2024-12-05',
    endDate: '2024-12-05',
    category: 'demo',
    startTime: '10:00',
    endTime: '12:00',
    description: '프로젝트 데모 발표',
    participants: ['userA', 'userB'],
  },
  {
    id: '4',
    title: '기말고사',
    startDate: '2024-12-08',
    endDate: '2024-12-10', // 3일 간
    category: 'exam',
    description: '기말고사 기간',
    participants: [],
  },
  {
    id: '5',
    title: 'branch/fe/WK4',
    startDate: '2024-12-24',
    endDate: '2024-12-24',
    category: 'branch',
    startTime: '19:00',
    endTime: '20:00',
    description: 'branch FE weekly 4차 모임',
    participants: ['userA'],
  },
  {
    id: '6',
    title: 'branch/ai/WK4',
    startDate: '2024-12-24',
    endDate: '2024-12-24',
    category: 'branch',
    startTime: '15:00',
    endTime: '16:30',
    description: 'branch AI weekly 4차 모임',
    participants: ['userA'],
  },
  {
    id: '7',
    title: 'Solution Challenge',
    startDate: '2024-12-26',
    endDate: '2024-12-27', // 2일 간
    category: 'solution',
    startTime: '19:00',
    endTime: '21:00',
    description: '팀 빌딩 및 아이디어 논의',
    participants: ['userA', 'userB'],
  },
];

const CalendarPage: React.FC = () => {
  // 현재 로그인 사용자 (예: 'userB')
  const currentUser = 'userB';

  // My Activities 스위치
  const [showMyActivities, setShowMyActivities] = useState(false);

  // 선택된 날짜 (모달용)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // 모달 오픈 여부
  const [modalOpen, setModalOpen] = useState(false);
  // 모달에 표시할 일정들
  const [modalItems, setModalItems] = useState<ActivityItem[]>([]);

  // 일정 필터링
  const filteredActivities = useMemo(() => {
    if (showMyActivities) {
      return sampleActivities.filter((act) =>
        act.participants?.includes(currentUser),
      );
    }
    return sampleActivities;
  }, [showMyActivities, currentUser]);

  // 달력 날짜 클릭
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    // date가 startDate~endDate 범위 안에 있는 일정들
    const matched = filteredActivities.filter((act) =>
      isDateInRange(date, act.startDate, act.endDate),
    );
    setModalItems(matched);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDate(null);
  };

  // 달력의 각 날짜(tile)에 그려질 내용
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const matched = filteredActivities.filter((act) =>
        isDateInRange(date, act.startDate, act.endDate),
      );
      if (matched.length === 0) return null;

      const MAX_SHOW = 2;
      const visibleEvents = matched.slice(0, MAX_SHOW);
      const extraCount = matched.length - MAX_SHOW;

      return (
        <div className="day-events-container">
          {visibleEvents.map((ev) => (
            <div key={ev.id} className={`event-label ${ev.category}`}>
              {ev.title}
            </div>
          ))}
          {extraCount > 0 && (
            <div className="event-label more-count">
              + {extraCount}건
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // 일정이 있는 날짜면 클래스 추가
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const matched = filteredActivities.filter((act) =>
        isDateInRange(date, act.startDate, act.endDate),
      );
      if (matched.length > 0) {
        return 'has-activities';
      }
    }
    return '';
  };

  return (
    <div className="calendar-page-container">
      <main className="calendar-main">
        {/* 상단 헤더 */}
        <div className="calendar-header">
          <h1>Calendar</h1>

          <div className="toggle-container">
            <label className="switch">
              <input
                type="checkbox"
                checked={showMyActivities}
                onChange={() => setShowMyActivities(!showMyActivities)}
              />
              <span className="slider round"></span>
            </label>
            <span className="toggle-label">My Activities</span>
          </div>
        </div>

        {/* 달력 영역 */}
        <div className="calendar-wrapper">
          <Calendar
            onClickDay={handleDayClick}
            tileContent={tileContent}
            tileClassName={tileClassName}
            locale="en-GB"
            maxDetail="month"
            prevLabel="<<"
            nextLabel=">>"
            prev2Label={null}
            next2Label={null}
          />
        </div>

        {/* 모달 (ActivityModal을 직접 쓰거나, 여기서 구현도 가능) */}
        {modalOpen && selectedDate && (
          <ActivityModal
            date={selectedDate}
            // ActivityModal용으로 형식 맞추기
            activities={modalItems.map((act) => ({
              id: act.id,
              title: act.title,
              date: act.startDate,  // 단일 날짜만 표시한다면?
              category: act.category,
              startTime: act.startTime,
              endTime: act.endTime,
              description: act.description,
            }))}
            onClose={closeModal}
          />
        )}
        {/* 하단 CTA 카드들 */}
        <div className="cta-cards-container">
          <h2>My Activities</h2>
          <div className="cta-cards-row">
            {/* <img> 대신 <Image> 로 교체하여 ESLint 경고 제거 */}
            <div className="cta-card">
              <Image
                src="/fetch.png"
                alt="fetch"
                width={50}
                height={50}
              />
              <span>fetch</span>
            </div>
            <div className="cta-card">
              <Image
                src="/branch.png"
                alt="branch"
                width={50}
                height={50}
              />
              <span>branch</span>
            </div>
            <div className="cta-card">
              <Image
                src="/worktree.png"
                alt="worktree"
                width={50}
                height={50}
              />
              <span>worktree</span>
            </div>
            <div className="cta-card">
              <Image
                src="/solution.png"
                alt="Solution Challenge"
                width={50}
                height={50}
              />
              <span>Solution Challenge</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;
