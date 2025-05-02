"use client";

import { useState } from "react";
import Calendar from "./_components/Calendar";
import styled from "styled-components";
import Activities from "./_components/Activities";

interface EventData {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  url: string;
}

export default function CalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <StyledContainer>
      <section role="calendar">
        <Calendar />
      </section>
      <section role="user-activities">
        <Activities />
      </section>

      {isModalOpen && selectedEvent && (
        <div onClick={closeModal}>
          <div onClick={(e) => e.stopPropagation()}>
            <h2>{selectedEvent.title}</h2>
            <div>
              <p>Location: {selectedEvent.location}</p>
              <p>Start: {selectedEvent.start_date}</p>
              <p>End: {selectedEvent.end_date}</p>
              <p>
                URL:{" "}
                <a href={selectedEvent.url} target="_blank" rel="noreferrer">
                  {selectedEvent.url}
                </a>
              </p>
            </div>
            <div>
              <button onClick={closeModal}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  padding-top: 32px;
  padding-left: 40px;

  display: flex;
  flex-direction: column;
  gap: 20px;
`;
