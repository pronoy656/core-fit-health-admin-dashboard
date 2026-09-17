import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { env } from '@/env';
import { getAccessToken } from '@/lib/cookie-client';
import { ISupportTicket, ITicketMessage } from '@/types/support-ticket';

// Define expected event interfaces based on backend schema
interface ServerToClientEvents {
  TICKET_REPLY: (payload: { ticket: ISupportTicket; message: ITicketMessage }) => void;
  TICKET_STATUS_CHANGED: (payload: { ticketId: string; from: string; to: string }) => void;
  TICKET_PRIORITY_CHANGED: (payload: { ticketId: string; from: string; to: string }) => void;
  TICKET_CREATED: (payload: { ticket: ISupportTicket; message: ITicketMessage }) => void;
}

interface ClientToServerEvents {
  JOIN_TICKET: (ticketId: string) => void;
  LEAVE_TICKET: (ticketId: string) => void;
}

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  useEffect(() => {
    // Determine socket URL from API URL (removing /api/v1 if present)
    const apiUrl = env.NEXT_PUBLIC_API_URL || 'http://localhost:5004';
    const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, '');

    const token = getAccessToken();
    
    // Initialize socket connection
    const socket = io(baseUrl, {
      auth: {
        token: `Bearer ${token}`
      },
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      // Automatically join admin-tickets room if user is admin
      socket.emit('JOIN_TICKET', 'admin-tickets'); 
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const joinTicket = (ticketId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('JOIN_TICKET', ticketId);
    }
  };

  const leaveTicket = (ticketId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('LEAVE_TICKET', ticketId);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    joinTicket,
    leaveTicket
  };
}
