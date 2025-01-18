'use client';
import React, {useState} from 'react';
import Image from 'next/image';
import Link from "next/link"
import './ActivityModal.css';


interface ActivityItem {
  title: string;
  start: Date;
  end: Date;
  location: string;
  link: string;
}

interface ActivityModalProps {
  activity: ActivityItem; 
  onClose: () => void;
}


const ActivityModal: React.FC<ActivityModalProps> = ({ activity, onClose }) => {
  
  const [attendance, setAttendance] = useState(false)

  // TODO 
  // request 날려서 지각 여부, 출석 유효 여부 response 받아야 함

  const AttendanceCheck = () => {
    setAttendance(true)
  }

  const CreateDayandTime = (date:Date) => {
    const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

    const month = months[date.getMonth()]; 
    const day = date.getDate(); 
    const weekday = weekdays[date.getDay()]; 

    const formattedDate = `${month} ${day}일(${weekday})`;
    return formattedDate
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>{activity.title}</h2>
        <div className="modal-body">
          <Image className="modal-icon" src="/time.svg" alt = "time"/>
          <div>{CreateDayandTime(activity.start)} ~ {CreateDayandTime(activity.end)}</div>
        </div>
        <div className="modal-body">
          <Image className="modal-icon" src="/location.svg" alt = 'location'/>{activity.location}</div>
        <Link className="modal-body" href={activity.link}><Image className="modal-icon" src="/link.svg" alt = "link" />{activity.link}</Link>
        <div className="attendance-button-container">
          <button className={`attendance-button ${attendance ? 'complete' : 'incomplete'}`} onClick={AttendanceCheck}>출석</button>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
