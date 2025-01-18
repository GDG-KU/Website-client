'use client'
import React, {useState, useEffect} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

import './ActivityAddModal.css'

interface ActivityAddModalProps {
    onClose: () => void;
  }

const ActivityAddModal: React.FC<ActivityAddModalProps> = ({onClose}) => {
    const [tag, setTag] = useState<string>("")
    const [eventName, setEventName] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [link, setLink] = useState<string>("")
    const [startDate, setStartDate] = useState<Date|null>(null);
    const [endDate, setEndDate] = useState<Date|null>(null);

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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Submitted value")
    }

    return (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={onClose}>
              ×
            </button>
            <form onSubmit={handleSubmit}>
                <div className="tag-select-wrapper">
                    <div className={`tag-show tag-${tag}`}></div>
                    <select value={tag} onChange={handleTagChange}>
                        <option value=""></option>
                        <option value="branch">branch</option>
                        <option value="fetch">fetch</option>
                    </select>
                </div>
                <button className="save-button" type="submit">저장</button>
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
                            dateFormat=""
                            placeholderText='StartDate'
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
                            ]}                        />
                        <DatePicker
                            selected={endDate}
                            onChange={handleEndDateChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            dateFormat=""
                            placeholderText='StartDate'
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
            </form>
          </div>
        </div>
    )
}

export default ActivityAddModal;