'use client';
import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from "next/link"
import { fetchWithAuth } from '@/utils/fetchWithAuth';

import './ActivityModal.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ActivityItem {
  id: string;
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
  const [startDayPrint, setStartDayPrint] = useState<string>("")
  const [endDayPrint, setEndDayPrint] = useState<string>("")
  const [startTimePrint, setStartTimePrint] = useState<string>("")
  const [endTimePrint, setEndTimePrint] = useState<string>("")

  useEffect(() => {
    const fetchAttendance = async() => {
      try{
        const res = await fetchWithAuth(`${API_BASE_URL}/attendance/${activity.id}`,{
          method: 'GET',
          headers: {
            accept: 'application/json'
          }
        })
        if (!res.ok) console.log(`Fetch attendance failed ${res.status}`)
        const data = await res.json()

        if (data.is_attend)
          setAttendance(AttendanceStatus.Present)
        else if (data.is_attend)
          setAttendance(AttendanceStatus.Absent)
      } catch(error){
        console.log(error)
      }
    }
    fetchAttendance()
  }, [activity.id])

  useEffect(() => {
    // const currentTime = new Date().getTime(); //출석 체크 알고리즘에 필요한 코드
    setStartDayPrint(CreateDay(activity.start));
    setStartTimePrint(CreateTime(activity.start));
    setEndDayPrint(CreateDay(activity.end));
    setEndTimePrint(CreateTime(activity.end));

    // 멤버의 출석 현황을 가져옴
    const attendanceFetch = async() => {
      try{
        const res = await fetchWithAuth(`${API_BASE_URL}/attendance/${activity.id}`,{
          method: 'POST',
          headers: {
            accept: "application/json"
          },
        })
        if (!res.ok){
          throw new Error("Attendance Fetch Failed")
        }
        const data = await res.json();

        if (data.is_attend) setAttendance(AttendanceStatus.Present)
        else setAttendance(AttendanceStatus.Absent)
      } catch(error) {
        console.log(error)
        setAttendance(AttendanceStatus.Error)
      }
    }

    attendanceFetch()
  }, [activity]);

  // 출석 체크 알고리즘 - 필요 없어짐

  // const AttendanceCheck = async(start:Date, end:Date) => {
  //   const timeMarginInMin = 5
  //   const lateMargin = 1000*60*(timeMarginInMin+1)
  //   const startMargin = 1000*60*timeMarginInMin*-1
  //   const currentTime = new Date();
  //   const diffInMs = currentTime.getTime() - start.getTime()

  //   const base_url = `${API_BASE_URL}/attendance/${activity.id}/`

  //   if (currentTime.getTime()>end.getTime()){
  //     alert(`해당 이벤트는 이미 종료되어 출석이 불가능합니다.`)
  //     setAttendance(AttendanceStatus.Absent)

  //     const res = await fetchWithAuth(base_url, {
  //       method: 'PATCH',
  //       headers: {
  //         accept: '*/*'
  //       },
  //       body: '',
  //     })
  //     if (!res.ok) throw Error("Failed to fetch attendance");
  //     const data = await res.json();
  //   }

  //   else if (diffInMs>lateMargin) { 
  //     setAttendance(AttendanceStatus.Late)

  //     const params = new URLSearchParams({
  //       event_id: activity.id, 
  //       reason: "too late", 
  //       is_attend: "false"
  //     });

  //     const res = await fetchWithAuth(`${base_url}?${params.toString()}`, {
  //       method: 'PATCH',
  //       headers: {
  //         accept: '*/*'
  //       }
  //     })
  //     if (!res.ok) throw Error("Failed to fetch attendance");
  //     const data = await res.json();
  //   }

  //   else if (diffInMs<startMargin) {
  //     alert(`아직 출석 시간이 아닙니다. 출석은 시작 시간 ${timeMarginInMin}분 전부터 가능합니다.`)
  //   }
  //   else {
  //     const res = await fetchWithAuth(base_url, {
  //       method: 'POST',
  //       headers: {
  //         accept: "*/*",
  //       },
  //       body: '',
  //     })
  //     if (!res.ok) throw Error("Failed to fetch attendance");
  //     const data = await res.json();
  //   }
  // }

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
        <div className="modal-title">{activity.title}</div>
        <div className="modal-body event-time-container">
          <Image className="modal-icon time-icon" src="/time.svg" alt="time" width={20} height={20}/>
          {(startDayPrint===endDayPrint) ?
          <div className="event-time-text-container">
            <div className="modal-body-day">{startDayPrint}</div>
            <div className="event-time-wrapper">
              <div className="modal-body-time">{startTimePrint} </div>
              <Image className="time-arrow" src="/time-arrow.png" alt="time-arrow" width={10} height={10}></Image>
              <div className="modal-body-time"> {endTimePrint}</div>
            </div>
          </div>
          :
          <div className="event-time-text-container">
            <div className="event-time-wrapper">
              <div className="modal-body-day">{startDayPrint}</div>
              <div className="modal-body-time left-margin">{startTimePrint}</div>
            </div>
            <div className="event-end-time-container">
              <div className="event-time-wrapper">
                <Image className="time-arrow" src="/time-arrow.png" alt="time-arrow" width={10} height={5}></Image>
                <div className="modal-body-day">{endDayPrint}</div>
                <div className="modal-body-time left-margin">{endTimePrint}</div>
              </div>
            </div>
          </div>
          }
        </div>
        <div className="modal-body">
          <Image className="modal-icon" src="/location.svg" alt="location" width={20} height={20}/>
          <div className="modal-body-text">{activity.location}</div>
        </div>
        <div className="modal-body">
          {/* figma에서 가져온 링크 아이콘 자체가 아래에만 여백이 있어서 글자와 baseline이 안 맞아 보임 */}
          <Image className="modal-icon link-icon" src="/link.svg" alt="link" width={20} height={20}/>
          <Link className="link modal-body-text" href={activity.link}>{activity.link}</Link>
        </div>
        <div className="attendance-badge-container">
          <div className={`attendance-badge ${attendance}`}>{attendance}</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
