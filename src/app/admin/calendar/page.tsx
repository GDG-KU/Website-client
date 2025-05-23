"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import styled from "styled-components";

type Event = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  url: string;
};

const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: "Mock Event",
    start_date: "2025-05-01T00:00:00.000Z",
    end_date: "2025-05-02T00:00:00.000Z",
    location: "Mock Location",
    url: "http://mock.com",
  },
  {
    id: 2,
    title: "Another Mock Event",
    start_date: "2025-05-05T09:00:00.000Z",
    end_date: "2025-05-05T11:00:00.000Z",
    location: "Online",
    url: "http://mock2.com",
  },
];

const CALENDAR_EVENTS = MOCK_EVENTS.map(({ id, title, start_date, end_date, location, url }) => ({
  id: id.toString(),
  title,
  start: start_date,
  end: end_date,
  extendedProps: { location, url },
}));

export default function AdminCalendarPage() {
  return (
    <StyledContainer>
      <StyledCalendarHeader>
        <h3>December 2024</h3>
        <div>TODO: Switch 영역</div>
      </StyledCalendarHeader>
      <StyledCalendarWrapper>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          dateClick={(arg) => {
            console.log(arg);
          }}
          locale="ko"
          initialView="dayGridMonth"
          events={CALENDAR_EVENTS}
          eventClick={(args) => {
            const found = CALENDAR_EVENTS.find((e) => e.id === args.event.id);
            console.log(found);
          }}
          businessHours
          firstDay={0}
          headerToolbar={false}
        />
      </StyledCalendarWrapper>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  padding: 12px 0;

  display: flex;
  flex-direction: column;
  gap: 8px;

  background-color: #ffffff;
  border-radius: 16px;

  filter: drop-shadow(rgba(0, 0, 0, 0.06) 0 2px 20px);
`;

const StyledCalendarHeader = styled.div`
  padding-inline: 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-size: 24px;
    font-weight: 700;
  }
`;

const StyledCalendarWrapper = styled.div`
  .fc-scrollgrid {
    border-width: 0;

    th {
      border-left: none;
    }

    th,
    td {
      border-right: none;
    }

    td {
      border-bottom: none;
    }
  }
`;
