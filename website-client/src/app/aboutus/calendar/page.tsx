'use client';
import React, { useState, useMemo } from 'react';
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
  )
}

export default Calendar;