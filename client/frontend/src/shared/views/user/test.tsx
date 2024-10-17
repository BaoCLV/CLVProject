"use client"
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3005');
interface Noti {
    type: string;
    [key: string]: any; // Allow for dynamic properties
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Noti[]>([]);

  useEffect(() => {
    socket.on('request_created', (data) => {
      console.log('Request Created:', data);
      setNotifications((prev) => [...prev, { type: 'Request Created', ...data }]);
    });

    socket.on('request_approved', (data) => {
      console.log('Request Approved:', data);
      setNotifications((prev) => [...prev, { type: 'Request Approved', ...data }]);
    });

    socket.on('request_rejected', (data) => {
      console.log('Request Rejected:', data);
      setNotifications((prev) => [...prev, { type: 'Request Rejected', ...data }]);
    });

    return () => {
      socket.off('request_created');
      socket.off('request_approved');
      socket.off('request_rejected');
    };
  }, []);

  return (
    <div>
      {notifications.map((notification, index) => (
        <div key={index}>
          <p>{notification.type}: {JSON.stringify(notification)}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;