'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { DatesSetArg, EventClickArg } from '@fullcalendar/core/index.js';

import ActivityModal from '@/components/ActivityModal';
import { ActivityItem } from '@/components/ActivityModal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    start_date: new Date("2025-01-27T16:00:00"),
    end_date: new Date("2025-01-27T20:00:00"),
    location: "우정정보관 201호",
    url: `${API_BASE_URL}/localevents/branch`,
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
    start_date: new Date("2025-01-27T23:40:00"),
    end_date: new Date("2025-01-28T20:00:00"),
    location: "우정정보관 201호",
    url: `${API_BASE_URL}/localevents/worktree/너무길어서말줄임표해야해요`,
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
  const [showMyActivities, setShowMyActivities] = useState<boolean>(true);
  const [viewStartDate, setViewStartDate] = useState<Date>(new Date())
  const [viewEndDate, setViewEndDate] = useState<Date>(new Date())
  const [backendRes, setBackendRes] = useState<backendResponse[]>(mockBackendResponse)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string|null>(null);

  const [modalOpen, setModalOpen] = useState(false)
  const [modalItems, setModalItems] = useState<ActivityItem>({
    id: "1",
    title: "branch",
    start: new Date("2025-01-15T18:00:00"),
    end: new Date("2025-01-17T18:00:00"),
    location: "우정정보관",
    link: `${API_BASE_URL}/`
  })
  const closeModal = () => {
    setModalOpen(false);
  };
  
  // 이벤트(activity) 클릭 시
  const eventClickHandler = (info:EventClickArg) => {
    info.jsEvent.preventDefault(); // event가 url 속성을 가지고 있을 경우 클릭 시 자동으로 url을 방문하는 기본 동작 방지 - 참고 https://fullcalendar.io/docs/eventClick

    setModalOpen(true)
    setModalItems({
        id: info.event.id,
        title: info.event.title,
        start: info.event.start!,
        end: info.event.end!,
        location: info.event.extendedProps.location,
        link: info.event.url
    })

    const popover = document.querySelector(".fc-popover");
    if (popover) {
      popover.remove();

      setTimeout(() => {
        const newPopover = document.querySelector(".fc-popover");
        if (newPopover) {
          newPopover.remove();
        }
      }, 10);
      console.log("popover 제거 성공")
    }
  }

  // 달력에 표시되는 달(month)을 바꿀 경우
  const handleDatesSet = (info: DatesSetArg) => {
    setViewStartDate(info.start);
    setViewEndDate(info.end);
  } 

  // 백엔드 응답을 fullcalendar의 event prop 양식으로 변환
  const backendResponseToEvent = (backendRes: backendResponse[]) => {
    const events = backendRes.map((bR) => ({
      id: bR.id.toString(),
      title: bR.title,
      start: bR.start_date!,
      end: bR.end_date!,
      location: bR.location, // 사용자 정의 필드이므로 .extendedProps.location으로 접근해야함
      url: bR.url,
      classNames: bR.tag.tag.tag_property.tag_property
    }));
    return events
  }

  // event 받아오기
  useEffect(() => {    
    const url = 
    `${API_BASE_URL}/event/bydate?` +
    new URLSearchParams({
      start_date: viewStartDate.toISOString(),
      end_date: viewEndDate.toISOString(),
      is_my_activity: showMyActivities.toString()
    }).toString();

    // const url = "https://koreauniv.gdgoc.kr/event/all"
    
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if(!response.ok) {
          console.log(response.status)
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json();
      })
      .then((data: backendResponse[]) => {
        setBackendRes(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [showMyActivities, currentUser, viewStartDate, viewEndDate])

  // 로딩 화면
  if (loading) {
    return (<div>Loading...</div>)
  }

  // 에러 화면
  if (error) {
    // return (<div>Error</div>)
  }

  // 정상 화면
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
            aspectRatio={1.75}
            headerToolbar={{
              left: 'prev',
              center: 'title',
              right: 'next'
            }}
            events = {backendResponseToEvent(backendRes)} 
            dayMaxEventRows = {true} // grid를 넘치는 이벤트는 줄여서 표기, 표시할 이벤트 개수를 작성해도 됨
            eventClick={eventClickHandler}
            datesSet={handleDatesSet}
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