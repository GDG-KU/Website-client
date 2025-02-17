'use client';

import React, { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CreateUser() {
  const [message, setMessage] = useState('');

  const handleCreateUser = async () => {
    try {
      const payload = {
        email: "jerrylee1516@gmail.com",
        nickname: "이정재",
        department: "수학과",
        student_number: "2019160044",
        role_ids: [1, 4]
      };

      const res = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 201) {
        setMessage("User created successfully!");
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${res.status} - ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      setMessage(`Fetch error: ${err}`);
    }
  };

  return (
    <div>
      <button onClick={handleCreateUser}>Create User</button>
      {message && <p>{message}</p>}
    </div>
  );
}
