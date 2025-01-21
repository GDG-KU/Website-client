'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { EventClickArg } from '@fullcalendar/core/index.js';

import ActivityManageModal from '@/components/ActivityManageModal';
import { ActivityManageItem } from '@/components/ActivityManageModal';
import AdminManageButtons from '@/components/AdminManageButtons';


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
  start_date: Date | null;
  end_date: Date | null;
  location: string;
  url: string;
  tag: TagResponse;
}
/*
// 이벤트 양식 샘플
const mockEvents = [
  { title: 'Event 1', start_date: '2025-01-15', end_date: '2025-01-17', location: "우정정보관", url: "www.naver.com", participants: ['userB'] },
  { title: 'Event 4', start: '2025-01-15', end: '2025-01-17', participants: ['userA'] },
  { title: 'Event 2', start: '2025-01-18', allDay: true, description: "Lecture", participants: ['userA, userB'] },
  { title: 'Event 3', start: '2025-01-19T10:30:00', end: '2025-01-19T12:30:00', participants: [] },
];
*/
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

  const [modalOpen, setModalOpen] = useState(false)
  const [modalItems, setModalItems] = useState<ActivityManageItem|null>({
    id: "1",
    tag_id: "1",
    tag: "branch",
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

    setModalItems({
        id: info.event.extendedProps.eventID,
        tag_id: info.event.extendedProps.tag_id,
        tag: info.event.extendedProps.tag,
        title: info.event.title,
        start: info.event.start!,
        end: info.event.end!,
        location: info.event.extendedProps.location,
        link: info.event.url
    })
    setModalOpen(true)
  }

  const addEvent = () => {
    setModalItems(null)
    setModalOpen(true)
  }

  // 백엔드 응답을 fullcalendar의 event prop 양식으로 변환
  const backendResponseToEvent = (backendRes: backendResponse[]) => {
    const events = backendRes.map((bR) => ({
      eventID: bR.id,
      tag_id: bR.tag.tag.id,
      tag: bR.tag.tag.tag_property.tag_property,
      title: bR.title,
      start: bR.start_date!,
      end: bR.end_date!,
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
        </div>

        {/* 달력 영역 */}
        <div className="calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            aspectRatio={1.75}
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

        <button className="add-event-button" onClick={addEvent}>추가</button>
        
        {modalOpen && (
            <ActivityManageModal
            activity={modalItems}
            onClose={closeModal}
            />
        )}

        <div className="cta-cards-container">
          <AdminManageButtons></AdminManageButtons>
        </div>

      </main>
    </div>
  )
}

export default Calendar;