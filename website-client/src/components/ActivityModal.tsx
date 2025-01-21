'use client';
import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from "next/link"
import './ActivityModal.css';

export interface ActivityItem {
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

enum AttendanceStatus {
  Incomplete = "출석",
  Late = "지각",
  Present = "출석완료",
  Absent = "결석",
  Error = "오류"
}

const ActivityModal: React.FC<ActivityModalProps> = ({ activity, onClose }) => {
  // 이거 Attendance Status 받아오는 로직 필요(서버 단의 api 추가 필요)
  const [attendance, setAttendance] = useState<AttendanceStatus>(AttendanceStatus.Incomplete)
  const [timePrint, setTimePrint] = useState("")

  useEffect(() => {
    const currentTime = new Date().getTime();
    if (currentTime>activity.end.getTime()){
      setAttendance(AttendanceStatus.Absent);
    }
  }, [])
  
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


  const AttendanceCheck = async(start:Date, end:Date) => {
    const timeMarginInMin = 5
    const lateMargin = 1000*60*(timeMarginInMin+1)
    const startMargin = 1000*60*timeMarginInMin*-1
    const currentTime = new Date();
    const diffInMs = currentTime.getTime() - start.getTime()

    if (currentTime.getTime()>end.getTime()){
      alert(`해당 이벤트는 이미 종료되어 출석이 불가능합니다.`)
      setAttendance(AttendanceStatus.Absent)
    }
    else if (diffInMs>lateMargin) { 
      setAttendance(AttendanceStatus.Late)
    }
    else if (diffInMs<startMargin) {
      alert(`아직 출석 시간이 아닙니다. 출석은 시작 시간 ${timeMarginInMin}분 전부터 가능합니다.`)
    }
    else {
      const url = `http://localhost:3000/event/${activity.id}/attendance`

      try{
          const response = await fetch(url, {
          method: 'POST',
          headers: {
            accept: "*/*",
          },
          body: '',
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = response.json();
        console.log(`Attendance Success at ${currentTime}`)
        setAttendance(AttendanceStatus.Present)
      } catch(error) {
        console.error('Error: ', error)
        setAttendance(AttendanceStatus.Error)
        alert("오류 발생")
      }
    }
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
        <div className="modal-body">
          <Image className="modal-icon" src="/time.svg" alt="time" width={20} height={20}/>
            <div style={{whiteSpace: "pre-line"}}>{timePrint}</div></div>
        <div className="modal-body">
          <Image className="modal-icon" src="/location.svg" alt="location" width={20} height={20}/>{activity.location}</div>
        <Link className="modal-body" href={activity.link}>
          <Image className="modal-icon" src="/link.svg" alt="link" width={20} height={20}/>
          {activity.link}
        </Link>
        <div className="attendance-button-container">
          <button className={`attendance-button ${attendance}`} onClick={()=>AttendanceCheck(activity.start, activity.end)}>{attendance}</button>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
