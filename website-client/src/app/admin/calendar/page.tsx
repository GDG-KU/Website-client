'use client';
import React, { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { DatesSetArg, EventClickArg } from '@fullcalendar/core/index.js';

import ActivityManageModal from '@/components/ActivityManageModal';
import { ActivityManageItem } from '@/components/ActivityManageModal';
import AdminManageButtons from '@/components/AdminManageButtons';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

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
    start_date: new Date("2025-01-15T18:00:00"),
    end_date: new Date("2025-01-15T20:00:00"),
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
    start_date: new Date("2025-01-18T18:00:00"),
    end_date: new Date("2025-01-19T20:00:00"),
    location: "우정정보관 201호",
    url: `${API_BASE_URL}/localevents/worktree`,
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

  const [loading, setLoading] = useState<boolean>(false);
  const [viewStartDate, setViewStartDate] = useState<Date>(new Date())
  const [viewEndDate, setViewEndDate] = useState<Date>(new Date())
  const [backendRes, setBackendRes] = useState<backendResponse[]>(mockBackendResponse)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalItems, setModalItems] = useState<ActivityManageItem|null>({
    id: "1",
    tag_id: 1,
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
        id: info.event.id,
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

  // 달력에 표시되는 달(month)를 바꿀 경우
  const handleDatesSet = (info: DatesSetArg) => {
    setViewStartDate(info.start);
    setViewEndDate(info.end);
  } 

  const addEvent = () => {
    setModalItems(null)
    setModalOpen(true)
  }

  // 백엔드 응답을 fullcalendar의 event prop 양식으로 변환
  const backendResponseToEvent = (backendRes: backendResponse[]) => {
    const events = backendRes.map((bR) => ({
      id: bR.id.toString(),
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

  // event 받아오기
  useEffect(() => {
    const url = 
    `${API_BASE_URL}/event/bydate?` +
    new URLSearchParams({
      start_date: viewStartDate.toISOString(),
      end_date: viewEndDate.toISOString(),
      is_my_activity: "false"
    }).toString();

    // const url = `${API_BASE_URL}/event/all`
    
    const fetchEvents = async() => {
      try{
        const res = await fetchWithAuth(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        })
        if(!res.ok) {
          console.log(res.status)
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data:backendResponse[] = await res.json();

        setBackendRes(data);
      }
      catch (error) {
          setLoading(false);
          console.log("이벤트 조회 실패", error)
      };
    }

    fetchEvents()
  }, [viewStartDate, viewEndDate, modalOpen])

  // 로딩 화면
  if (loading) {
    return (<div>Loading...</div>)
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
            events = {backendResponseToEvent(backendRes)} 
            dayMaxEventRows = {true} // grid를 넘치는 이벤트는 줄여서 표기, 표시할 이벤트 개수를 작성해도 됨
            eventClick={eventClickHandler}
            datesSet={handleDatesSet}
          />
        </div>
          
        <div className="add-event-button-container">
          <button className="add-event-button" onClick={addEvent}>추가</button>
        </div>
        
        
        {modalOpen && (
            <ActivityManageModal
            activity={modalItems}
            onClose={closeModal}
            />
        )}

        <div className="admin-manage-buttons-container">
          <AdminManageButtons></AdminManageButtons>
        </div>

      </main>
    </div>
  )
}

export default Calendar;