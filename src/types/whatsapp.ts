// Tipos para integração com WhatsApp

export interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  profilePicture?: string;
  isGroup?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  body: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'document';
  timestamp: string | number;
  isFromMe: boolean;
  mediaUrl?: string;
  caption?: string;
}

export interface SendMessageParams {
  to: string;
  message: string;
  mediaUrl?: string;
  type?: 'text' | 'image' | 'audio' | 'video' | 'document';
}

