'use client';
import React from 'react';
import './ActivityModal.css';

interface ActivityItem {
  id: string;
  title: string;
  date: string;
  category: string;
  startTime?: string;
  endTime?: string;
  description?: string;
}

interface ActivityModalProps {
  date: Date;                // 선택된 날짜
  activities: ActivityItem[]; 
  onClose: () => void;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ date, activities, onClose }) => {
  const dateString = date.toISOString().split('T')[0];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>{dateString} 일정 상세</h2>
        {activities.length > 0 ? (
          <ul className="activities-ul">
            {activities.map((act) => (
              <li key={act.id} className="activity-li">
                <div className="activity-title">
                  <strong>{act.title}</strong> ({act.category})
                </div>
                {(act.startTime && act.endTime) && (
                  <div className="activity-time">
                    {act.startTime} ~ {act.endTime}
                  </div>
                )}
                {act.description && (
                  <div className="activity-description">
                    {act.description}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>이 날짜에는 등록된 일정이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ActivityModal;
