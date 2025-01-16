'use client';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { EventClickArg } from '@fullcalendar/core/index.js';

import ActivityModal from '@/components/ActivityModal';

interface TagResponse {
  "tag": {
      "id": number;
      "title": string;
      "tag_property": {
        "id": number;
        "tag_property": string;
      }
    }
}

interface backendResponse {
  id: number;
  title: string;
  start_date: Date;
  end_date: Date;
  location: string;
  url: string;
  tag: TagResponse;
}

// 이벤트 양식 샘플
const mockEvents = [
  { title: 'Event 1', start_date: '2025-01-15', end_date: '2025-01-17', location: "우정정보관", url: "www.naver.com", participants: ['userB'] },
  { title: 'Event 4', start: '2025-01-15', end: '2025-01-17', participants: ['userA'] },
  { title: 'Event 2', start: '2025-01-18', allDay: true, description: "Lecture", participants: ['userA, userB'] },
  { title: 'Event 3', start: '2025-01-19T10:30:00', end: '2025-01-19T12:30:00', participants: [] },
];

// 백엔드 응답 샘플
const mockBackendResponse: backendResponse[] = [
  { 
    id: 1,
    title: "branch1/week2",
    start_date: new Date("2025-01-15T18:00:00"),
    end_date: new Date("2025-01-15T20:00:00"),
    location: "우정정보관 201호",
    url: "http://localhost:3002/localevents/branch",
    tag: {
      "tag": {
        "id": 1,
        "title": "Tag title",
        "tag_property": {
          "id": 1,
          "tag_property": "branch"
        }
      }
    }
  },
  { 
    id: 2,
    title: "worktree",
    start_date: new Date("2025-01-18T18:00:00"),
    end_date: new Date("2025-01-19T20:00:00"),
    location: "우정정보관 201호",
    url: "http://localhost:3002/localevents/worktree",
    tag: {
      "tag": {
        "id": 2,
        "title": "Tag title",
        "tag_property": {
          "id": 2,
          "tag_property": "fetch"
        }
      }
    }
  }
];

const Calendar: React.FC = () => {

  const currentUser = 'userB'

  // My Activities 스위치
  const [showMyActivities, setShowMyActivities] = useState(false);
  // 일정 필터링 
  // TODO - 백엔드에서 response에 participants 필드 추가해주면 mockEvents를 backendResponseToEvent(mockbackendResponse)로 완전히 대체
  const filteredActivities = useMemo(() => {
    if (showMyActivities) {
      return mockEvents.filter((e) =>
        e.participants?.includes(currentUser),
      );
    }
    return mockEvents;
  }, [showMyActivities, currentUser]);


  const [modalOpen, setModalOpen] = useState(false)
  const [modalItems, setModalItems] = useState({
    title: "branch",
    start: new Date("2025-01-15T18:00:00"),
    end: new Date("2025-01-17T18:00:00"),
    location: "우정정보관",
    link: "www.naver.com"
  })
  const closeModal = () => {
    setModalOpen(false);
  };

  // 이벤트(activity) 클릭 시
  const eventClickHandler = (info:EventClickArg) => {
    info.jsEvent.preventDefault(); // event가 url 속성을 가지고 있을 경우 클릭 시 자동으로 url을 방문하는 기본 동작 방지 - 참고 https://fullcalendar.io/docs/eventClick

    setModalOpen((prev) => !prev)
    setModalItems({
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
        location: info.event.extendedProps.location,
        link: info.event.url
    })
  }

  // 백엔드 응답을 fullcalendar의 event prop 양식으로 변환
  const backendResponseToEvent = (backendRes: backendResponse[]) => {
    const events = backendRes.map((bR) => ({
      title: bR.title,
      start: bR.start_date,
      end: bR.end_date,
      location: bR.location, // 사용자 정의 필드이므로 .extendedProps.location으로 접근해야함
      url: bR.url,
      classNames: bR.tag.tag.tag_property.tag_property
    }));
    return events
  }
  // CTA 카드
  /*
  const ctaCardData = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    title: `Card ${i + 1}`,
    imgSrc: `/cta-card/card${i + 1}.svg`,
    link: `/another-page/card${i + 1}`, // 라우팅용
  }));
  */
  const ctaCardData = [
    { id: 1, title: 'branch-git', imgSrc: '/cta-card/cta-branch-git.svg', link: '/1' },
    { id: 2, title: 'branch-junior-ai', imgSrc: '/cta-card/cta-branch-junior-ai.svg', link: '/2' },
    { id: 3, title: 'branch-junior-be', imgSrc: '/cta-card/cta-branch-junior-be.svg', link: '/3' },
    { id: 4, title: 'branch-junior-flutter', imgSrc: '/cta-card/cta-branch-junior-flutter.svg', link: '/4' },
    { id: 5, title: 'branch-member1', imgSrc: '/cta-card/cta-branch-member1.svg', link: '/5' },
    { id: 6, title: 'branch-member2', imgSrc: '/cta-card/cta-branch-member2.svg', link: '/6' },
    { id: 7, title: 'fetch-ai', imgSrc: '/cta-card/cta-fetch-ai.svg', link: '/7' },
    { id: 8, title: 'fetch-be', imgSrc: '/cta-card/cta-fetch-be.svg', link: '/8' },
    { id: 9, title: 'fetch-dsgn', imgSrc: '/cta-card/cta-fetch-dsgn.svg', link: '/9' },
    { id: 10, title: 'fetch-fe', imgSrc: '/cta-card/cta-fetch-fe.svg', link: '/10' },
    { id: 11, title: 'solutionchallenge', imgSrc: '/cta-card/cta-solutionchallenge.svg', link: '/11' },
    { id: 12, title: 'worktree-design', imgSrc: '/cta-card/cta-worktree-design.svg', link: '/12' },
    { id: 13, title: 'worktree-discord', imgSrc: '/cta-card/cta-worktree-discord.svg', link: '/13' },
    { id: 14, title: 'worktree-goody', imgSrc: '/cta-card/cta-worktree-goody.svg', link: '/14' },
    { id: 15, title: 'worktree-history', imgSrc: '/cta-card/cta-worktree-history.svg', link: '/15' },
    { id: 16, title: 'worktree-wear', imgSrc: '/cta-card/cta-worktree-wear.svg', link: '/16' },
    { id: 17, title: 'worktree-website', imgSrc: '/cta-card/cta-worktree-website.svg', link: '/16' },
  ];
  // 가로 스크롤 참조
  const scrollRef = useRef<HTMLDivElement>(null);

  // auto-scroll
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;

    const { left, right, width } = scrollRef.current.getBoundingClientRect();
    // 화면에서 컨테이너의 절대 위치
    const mouseX = e.clientX;
    const containerLeft = left;
    const containerRight = right;

    // 어느 정도 범위를 정해서, 왼쪽 80px 근처면 왼쪽으로, 오른쪽 80px 근처면 오른쪽으로
    const edgeThreshold = 80;

    // 왼쪽 근처 → 스크롤 왼
    if (mouseX - containerLeft < edgeThreshold) {
      scrollRef.current.scrollBy({ left: -10, behavior: 'smooth' });
    }
    // 오른쪽 근처 → 스크롤 오른쪽
    else if (containerRight - mouseX < edgeThreshold) {
      scrollRef.current.scrollBy({ left: 10, behavior: 'smooth' });
    }
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
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev',
              center: 'title',
              right: 'next'
            }}
            events = {backendResponseToEvent(mockBackendResponse)} // json을 받아올 url을 넣어도 됨 (참고)-> https://fullcalendar.io/docs/events-json-feed 
            dayMaxEventRows = {true} // grid를 넘치는 이벤트는 줄여서 표기, 표시할 이벤트 개수를 작성해도 됨
            eventClick={eventClickHandler}
          />
        </div>
          
        {/* 모달 (ActivityModal을 직접 쓰거나, 여기서 구현도 가능) */}
        {modalOpen && (
          <ActivityModal
            // ActivityModal용으로 형식 맞추기
            activity={modalItems}
            onClose={closeModal}
          />
        )}

        {/* 하단 CTA 카드들 */}
        <div className="cta-cards-container">
          <h2>My activities</h2>
          <div
            className="cta-cards-row"
            onMouseMove={handleMouseMove}
            ref={scrollRef}
          >
            {ctaCardData.map((card) => (
              <a
                key={card.id}
                href={card.link}
                className="cta-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* SVG 이미지 */}
                <Image
                  src={card.imgSrc}
                  alt={card.title}
                  width={100}
                  height={100}
                />
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Calendar;