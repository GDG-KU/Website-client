'use client'
import React, {useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

import './ActivityManageModal.css'
import { fetchWithAuth } from '@/utils/fetchWrapper';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ActivityManageItem {
    id: string;
    tag_id: number;
    tag: string;
    title: string;
    start: Date;
    end: Date;
    location: string;
    link: string;
  }
  
interface ActivityManageModalProps {
    activity: ActivityManageItem|null; 
    onClose: () => void;
}

const ActivityManageModal: React.FC<ActivityManageModalProps> = ({activity, onClose}) => {

    const [tagProperty, setTagProperty] = useState<string>(activity !== null ? activity.tag : "")
    const [eventName, setEventName] = useState<string>(activity !== null ? activity.title : "");
    const [location, setLocation] = useState<string>(activity !== null ? activity.location : "");
    const [link, setLink] = useState<string>(activity !== null ? activity.link : "")
    const [startDate, setStartDate] = useState<Date|null>(activity !== null ? activity.start : null);
    const [endDate, setEndDate] = useState<Date|null>(activity !== null ? activity.end : null);
    const [optionsOpen, setOptionsOpen] = useState<boolean>(false)

    const dropdownRef = useRef<HTMLDivElement|null>(null)

    const handleEventNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEventName(event.target.value)
    }

    const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(event.target.value)
    }

    const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLink(event.target.value)
    }

    const handleStartDateChange = (date: Date|null) => {
        setStartDate(date);
    
    }

    const handleEndDateChange = (date: Date|null) => {
        setEndDate(date);

    }

    // 드롭다운 밖의 영역을 클릭할 때 드롭다운 닫히게 하는 코드
    useEffect(()=>{
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOptionsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    // 일정 추가/삭제/수정 

    const handleSave = async() => {
        const url = `${API_BASE_URL}/event`

        const requestBody = {
            title: eventName,
            start_date: startDate?.toISOString,
            end_date: endDate?.toISOString,
            location: location,
            url: link,
            tag_id: tagProperty // 어떤 이벤트가 어떤 tag_id인지 모름
        }

        try {
            const response = await fetchWithAuth(url, {
                method: 'POST',
                headers: {
                    accept: "application/json",
                },
                body: JSON.stringify(requestBody)
            });

            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json();
            console.log(data)
            console.log("event created successfully")

        } catch(error) {
            console.log("Error adding event", error)
        }
    }

    const handleModify = async() => {
        const url = API_BASE_URL + activity!.id.toString()

        const requestBody = {
            start_date: startDate,
            end_date: endDate,
            location: location,
            url: link,
            tag_id: tagProperty
        }

        try {
            const response = await fetchWithAuth(url, {
                method: 'PATCH',
                headers: {
                    accept: "application/json",
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json();
            console.log(data.message) 
        } catch (error) {
            console.log("Error modifying event", error)
        }
    }

    const handleDelete = async() => {
        const url = API_BASE_URL + activity!.id.toString()
        
        try {
            const response = await fetchWithAuth(url, {
                method: 'DELETE',
                headers: {
                    accept: "application/json"
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json();
            console.log(data.message)
        } catch(error) {
            console.log("Error deleting event", error)
        }

        onClose()
    }

    return (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={onClose}>
              ×
            </button>
            <div className="tag-select-wrapper">
                <div className="tag-select-display">
                    <Image src={`/badge_${tagProperty}.png`} alt="tag-select" width={100} height={20} quality={100}/>
                </div>
                <div className="tag-select-options">
                    <Image src='/arrow.png' alt="arrow" className={`dropdown-arrow ${optionsOpen ? "options-open" : "options-closed"}`}
                        width={15} height={15} onClick={()=>setOptionsOpen(prevState=>!prevState)}/>
                    {optionsOpen&&<div className="options-wrapper" ref={dropdownRef}>
                        <div className="tag-option" onClick={()=>{
                            setTagProperty("branch")
                            setOptionsOpen(false)
                        }}>branch</div>
                        <div className="tag-option" onClick={() => {
                            setTagProperty("fetch")
                            setOptionsOpen(false)
                        }}>fetch</div>
                        <div className="tag-option" onClick={() => {
                            setTagProperty("merge")
                            setOptionsOpen(false)
                        }}>merge</div>
                    </div>}
                </div>
            </div>

            <div className="inputField-container">
                <div className="inputField-wrapper">
                    <input
                        type="text"
                        value={eventName}
                        onChange={handleEventNameChange}
                        className="inputField event-name-inputField"
                        placeholder=' 이벤트 이름 입력'
                    ></input> 
                </div>
                <div className="time-select-wrapper">
                    <Image className="modal-icon" src="/time.svg" alt="time" width={20} height={20}/>
                    <DatePicker
                        className='datepicker'
                        selected={startDate}
                        onChange={handleStartDateChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="yyyy/MM/dd HH:mm"
                        placeholderText='시작 시간'
                        portalId="datepicker-portal"
                        popperModifiers={[
                            {
                                name: "preventOverflow",
                                options: {
                                    boundary: "viewport",
                                },
                                fn: (state) => state
                            },
                            {
                                name: "offset",
                                options: {
                                    offset: [0, 10],
                                },
                                fn: (state) => state
                            },
                        ]}                        
                    />
                    <DatePicker
                        className="datepicker"
                        selected={endDate}
                        onChange={handleEndDateChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="yyyy:MM:dd HH:mm"
                        placeholderText='종료 시간'
                        popperPlacement="bottom-start"
                        portalId="datepicker-portal"
                    /> 
                </div>
                <div className="inputField-wrapper">
                    <Image className="modal-icon" src="/location.svg" alt="location" width={20} height={20}/>
                    <input
                        type="text"
                        value={location}
                        onChange={handleLocationChange}
                        className="inputField"
                        placeholder='위치'
                    ></input>
                </div>
                <div className="inputField-wrapper">
                    <Image className="modal-icon" src="/link.svg" alt="link" width={20} height={20}/>
                    <input
                        type="text"
                        value={link}
                        onChange={handleLinkChange}
                        className="inputField"
                        placeholder='링크'
                    ></input> 
                </div>
            </div>
            <div className="activity-manage-buttons-container">
                
                {(activity===null)&&
                    <div className="activity-manager-buttons-wrapper">
                        <button className="event-save-button" onClick={handleSave}>저장</button>
                    </div>}
                {(activity!==null)&&
                    <div className="activity-manager-buttons-wrapper">
                        <button className="event-modify-button" onClick={handleModify}>수정</button>
                        <button className="event-delete-button" onClick={handleDelete}>삭제</button>
                    </div>
                }
            </div>
          </div>
        </div>
    )
}

export default ActivityManageModal;