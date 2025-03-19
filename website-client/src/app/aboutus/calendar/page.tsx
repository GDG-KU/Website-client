'use client';

import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import styles from './calendar.module.css';
import { EventClickArg } from '@fullcalendar/core';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface EventData {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  url: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const fetchAllEvents = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/event/all`);
      if (!res.ok) throw new Error('이벤트 조회 실패');
      const data: EventData[] = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('이벤트 조회 실패:', error);

      const mockData: EventData[] = [
        {
          id: 1,
          title: 'Mock Event',
          start_date: '2025-01-01T00:00:00Z',
          end_date: '2025-01-02T00:00:00Z',
          location: 'Mock Location',
          url: 'http://mock.com'
        },
        {
          id: 2,
          title: 'Another Mock Event',
          start_date: '2025-01-05T09:00:00Z',
          end_date: '2025-01-05T11:00:00Z',
          location: 'Online',
          url: 'http://mock2.com'
        }
      ];
      setEvents(mockData);
    }
  }, []);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const calendarEvents = events.map((evt) => ({
    id: String(evt.id),
    title: evt.title,
    start: evt.start_date,
    end: evt.end_date,
    extendedProps: {
      location: evt.location,
      url: evt.url
    }
  }));

  const handleEventClick = (info: EventClickArg) => {
    const found = events.find((e) => e.id === Number(info.event.id));
    if (found) {
      setSelectedEvent(found);
      setIsModalOpen(true);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className={styles['calendar-container']}>
      <section className={styles['calendar-section']}>
        <h2 className={styles['section-title']}>Calendar</h2>

        <div className={styles['calendar-wrapper']}>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            eventClick={handleEventClick}
            locale="ko"
            firstDay={0}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
          />
        </div>
      </section>

      <section className={styles['cards-section']}>
        <h2 className={styles['section-title']}>My Activities</h2>
        <div className={styles['cards-row']}>
          <div className={styles['cta-card']}>
            <div className={styles['cta-card-text']}>fetch</div>
          </div>
          <div className={styles['cta-card']}>
            <div className={styles['cta-card-text']}>branch</div>
          </div>
          <div className={styles['cta-card']}>
            <div className={styles['cta-card-text']}>worktree</div>
          </div>
          <div className={styles['cta-card']}>
            <div className={styles['cta-card-text']}>Solution Challenge</div>
          </div>
          <div className={styles['cta-card']}>
            <div className={styles['cta-card-text']}>Demo Day</div>
          </div>
        </div>
      </section>

      {isModalOpen && selectedEvent && (
        <div className={styles['modal-overlay']} onClick={closeModal}>
          <div className={styles['modal']} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles['modal-title']}>{selectedEvent.title}</h2>
            <div className={styles['modal-content']}>
              <p>Location: {selectedEvent.location}</p>
              <p>Start: {selectedEvent.start_date}</p>
              <p>End: {selectedEvent.end_date}</p>
              <p>
                URL:{' '}
                <a href={selectedEvent.url} target="_blank" rel="noreferrer">
                  {selectedEvent.url}
                </a>
              </p>
            </div>
            <div className={styles['modal-actions']}>
              <button className={styles['close-button']} onClick={closeModal}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
