'use client';
import React, {useState, useEffect} from 'react';
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

  const [timePrint, setTimePrint] = useState("")
  
  useEffect(() => {
    const startDay = CreateDay(activity.start);
    const startTime = CreateTime(activity.start);
    const endDay = CreateDay(activity.end);
    const endTime = CreateTime(activity.end);

    if (isSameDate(activity.start, activity.end)) {
      setTimePrint(`${startDay}${startTime} -> ${endTime}`);
    } else {
      setTimePrint(`${startDay} ${startTime}-> ${endDay} ${endTime}`);
    }
  }, [activity]);

  // TODO 
  // request 날려서 지각 여부, 출석 유효 여부 response 받아야 함

  const AttendanceCheck = () => {

    setAttendance(true)
  }

  const isSameDate = (date1: Date, date2: Date) => {
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    return formatDate(date1)===formatDate(date2);
  }

  const CreateDay = (date:Date) => {
    const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

    const month = months[date.getMonth()]; 
    const day = date.getDate(); 
    const weekday = weekdays[date.getDay()]; 

    const formattedDate = `${month} ${day}일(${weekday})`;
    return formattedDate
  }

  function CreateTime(date: Date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>{activity.title}</h2>
        <div className="modal-body"><img className="modal-icon" src="/time.svg"></img><div style={{whiteSpace: "pre-line"}}>{timePrint}</div></div>
        <div className="modal-body"><img className="modal-icon" src="/location.svg"></img>{activity.location}</div>
        <Link className="modal-body" href={activity.link}><img className="modal-icon" src="/link.svg"></img>{activity.link}</Link>
        <div className="attendance-button-container">
          <button className={`attendance-button ${attendance ? 'complete' : 'incomplete'}`} onClick={AttendanceCheck}>출석</button>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
