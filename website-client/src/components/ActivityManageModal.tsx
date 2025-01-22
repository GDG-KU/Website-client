'use client'
import React, {useState, useEffect} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

import './ActivityManageModal.css'

export interface ActivityManageItem {
    id: string;
    tag_id: string;
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
    const [id, setId] = useState<string>(activity !== null ? activity.id : "")
    const [tag_id, setTag_id] = useState<string>(activity !== null ? activity.tag_id : "")
    const [tag, setTag] = useState<string>(activity !== null ? activity.tag : "")
    const [eventName, setEventName] = useState<string>(activity !== null ? activity.title : "");
    const [location, setLocation] = useState<string>(activity !== null ? activity.location : "");
    const [link, setLink] = useState<string>(activity !== null ? activity.link : "")
    const [startDate, setStartDate] = useState<Date|null>(activity !== null ? activity.start : null);
    const [endDate, setEndDate] = useState<Date|null>(activity !== null ? activity.end : null);

    const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTag(event.target.value);
    }

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

    // 일정 추가/삭제/수정 
    const base_url='http://localhost:3000/event'

    const handleSave = async() => {
        const url = base_url

        const requestBody = {
            title: eventName,
            start_date: startDate,
            end_date: endDate,
            location: location,
            url: link,
            tag_id: tag_id
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody)
            });

            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json();

        } catch(error) {
            console.log("Error adding event", error)
        }
    }

    const handleModify = async() => {
        const url = base_url + "/" + activity!.id.toString()

        const requestBody = {
            start_date: startDate,
            end_date: endDate,
            location: location,
            url: link,
            tag_id: tag_id
        }

        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json"
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
        const url = base_url + "/" + activity!.id.toString()
        
        try {
            const response = await fetch(url, {
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
    }

    return (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={onClose}>
              ×
            </button>
            <div className="tag-select-wrapper">
                <div className={`tag-show tag-${tag}`}></div>
                <select value={tag} onChange={handleTagChange}>
                    <option value=""></option>
                    <option value="branch">branch</option>
                    <option value="fetch">fetch</option>
                </select>
            </div>
            <div className="inputField-container">
                <div className="inputField-wrapper">
                    <input
                        type="text"
                        value={eventName}
                        onChange={handleEventNameChange}
                        className="inputField"
                        placeholder='이름 입력'
                    ></input> 
                </div>
                <div className="time-select-wrapper">
                    <img className="modal-icon" src="/time.svg"></img>
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
                    <img className="modal-icon" src="/location.svg"></img>
                    <input
                        type="text"
                        value={location}
                        onChange={handleLocationChange}
                        className="inputField"
                        placeholder='위치'
                    ></input>
                </div>
                <div className="inputField-wrapper">
                    <img className="modal-icon" src="/link.svg"></img>
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
                {(activity===null)&&<button className="save-button" onClick={handleSave}>저장</button>}
                {(activity!==null)&&
                    <div className="activity-manager-buttons-wrapper">
                        <button className="modify-button" onClick={handleModify}>수정</button>
                        <button className="delete-button" onClick={handleDelete}>삭제</button>
                    </div>
                }
            </div>
          </div>
        </div>
    )
}

export default ActivityManageModal;