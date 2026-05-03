import React, { useEffect, useState, useRef } from 'react';
import { Bell, ExternalLink, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/services/api';

interface Notification {
  id: number;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get('/notifications');
      const data = response.data;
      if (data.success) {
        setNotifications(data.data);
        // For global notifications, we use local storage to track "read" status
        const readIds = JSON.parse(localStorage.getItem('read_notifications') || '[]');
        const unread = data.data.filter((n: Notification) => !readIds.includes(n.id)).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Mark all as read when opening
      const readIds = JSON.parse(localStorage.getItem('read_notifications') || '[]');
      const newReadIds = [...new Set([...readIds, ...notifications.map(n => n.id)])];
      localStorage.setItem('read_notifications', JSON.stringify(newReadIds));
      setUnreadCount(0);
    }
  };

  const handleNotificationClick = (link: string, id: number) => {
    setIsOpen(false);
    navigate(link);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="relative p-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-[450px] overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="border-b border-gray-800 bg-gray-800/50 p-4 flex justify-between items-center">
            <h3 className="font-bold text-white">Thông báo</h3>
            <span className="text-xs text-gray-400">{notifications.length} thông báo mới</span>
          </div>
          
          <div className="overflow-y-auto max-h-[350px] scrollbar-thin scrollbar-thumb-gray-700">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 italic">
                Không có thông báo nào
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.link, notification.id)}
                  className="group relative border-b border-gray-800/50 p-4 hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-yellow-500 group-hover:text-yellow-400 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                      {notification.title}
                    </h4>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock size={10} />
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-2 mb-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="flex justify-end">
                    <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Xem chi tiết <ExternalLink size={10} />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="border-t border-gray-800 bg-gray-800/30 p-2 text-center">
            <button 
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
