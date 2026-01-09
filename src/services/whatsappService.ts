// Serviço para integração com API do WhatsApp
// Suporta diferentes APIs: Evolution API, Twilio, WhatsApp Business API, etc.

interface WhatsAppConfig {
  apiUrl: string;
  apiKey?: string;
  instanceName?: string;
  token?: string;
}

// Configuração da API - ajuste conforme sua API
const getConfig = (): WhatsAppConfig => {
  // Você pode usar variáveis de ambiente ou um arquivo de configuração
  return {
    apiUrl: import.meta.env.VITE_WHATSAPP_API_URL || 'http://localhost:8080',
    apiKey: import.meta.env.VITE_WHATSAPP_API_KEY || '',
    instanceName: import.meta.env.VITE_WHATSAPP_INSTANCE || 'default',
    token: import.meta.env.VITE_WHATSAPP_TOKEN || ''
  };
};

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
  from: string; // número do remetente
  to: string; // número do destinatário
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

// Função auxiliar para fazer requisições
const makeRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<any> => {
  const config = getConfig();
  const url = `${config.apiUrl}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Adiciona autenticação conforme necessário
  if (config.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  } else if (config.token) {
    headers['Authorization'] = `Bearer ${config.token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na requisição WhatsApp API:', error);
    throw error;
  }
};

// Buscar todos os contatos/conversas
export const getContacts = async (): Promise<WhatsAppContact[]> => {
  try {
    const config = getConfig();
    
    // Exemplo para Evolution API
    // Ajuste o endpoint conforme sua API
    const endpoint = `/chat/fetchChats/${config.instanceName}`;
    const data = await makeRequest(endpoint);
    
    // Transforma os dados da API para o formato esperado
    return data.map((chat: any) => ({
      id: chat.id || chat.jid || chat.phone,
      name: chat.name || chat.pushName || chat.phone,
      phone: chat.phone || chat.jid?.split('@')[0] || chat.id,
      profilePicture: chat.profilePicture,
      isGroup: chat.isGroup || false,
      lastMessage: chat.lastMessage?.body || chat.lastMessage,
      lastMessageTime: chat.lastMessageTime || chat.timestamp,
      unreadCount: chat.unat || chat.unreadCount || 0,
    }));
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    // Retorna array vazio em caso de erro para não quebrar a aplicação
    return [];
  }
};

// Buscar mensagens de um contato específico
export const getMessages = async (phoneNumber: string): Promise<WhatsAppMessage[]> => {
  try {
    const config = getConfig();
    
    // Normaliza o número de telefone (remove caracteres especiais)
    const normalizedPhone = phoneNumber.replace(/\D/g, '');
    
    // Exemplo para Evolution API
    // Ajuste o endpoint conforme sua API
    const endpoint = `/chat/fetchMessages/${config.instanceName}/${normalizedPhone}`;
    const data = await makeRequest(endpoint);
    
    // Transforma os dados da API para o formato esperado
    return data.map((msg: any) => ({
      id: msg.key?.id || msg.id || `msg_${Date.now()}_${Math.random()}`,
      from: msg.from || msg.key?.remoteJid?.split('@')[0] || normalizedPhone,
      to: msg.to || config.instanceName,
      body: msg.message?.conversation || msg.body || msg.message?.extendedTextMessage?.text || '',
      type: detectMessageType(msg),
      timestamp: msg.messageTimestamp || msg.timestamp || Date.now(),
      isFromMe: msg.key?.fromMe || msg.fromMe || false,
      mediaUrl: getMediaUrl(msg),
      caption: msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption || '',
    }));
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    return [];
  }
};

// Função auxiliar para detectar o tipo de mensagem
const detectMessageType = (msg: any): 'text' | 'image' | 'audio' | 'video' | 'document' => {
  if (msg.message?.imageMessage) return 'image';
  if (msg.message?.audioMessage || msg.message?.pttMessage) return 'audio';
  if (msg.message?.videoMessage) return 'video';
  if (msg.message?.documentMessage) return 'document';
  return 'text';
};

// Função auxiliar para obter URL da mídia
const getMediaUrl = (msg: any): string | undefined => {
  const mediaMessage = msg.message?.imageMessage || 
                      msg.message?.videoMessage || 
                      msg.message?.audioMessage ||
                      msg.message?.documentMessage;
  
  if (mediaMessage?.url) return mediaMessage.url;
  if (mediaMessage?.mimetype) {
    // Se sua API retorna apenas o mimetype, você pode precisar construir a URL
    const config = getConfig();
    return `${config.apiUrl}/message/media/${msg.key?.id}`;
  }
  return undefined;
};

// Enviar mensagem de texto
export const sendTextMessage = async (params: SendMessageParams): Promise<boolean> => {
  try {
    const config = getConfig();
    const normalizedPhone = params.to.replace(/\D/g, '');
    
    // Exemplo para Evolution API
    // Ajuste o endpoint e body conforme sua API
    const endpoint = `/message/sendText/${config.instanceName}`;
    const body = {
      number: normalizedPhone,
      text: params.message,
    };
    
    await makeRequest(endpoint, 'POST', body);
    return true;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return false;
  }
};

// Enviar mensagem com mídia
export const sendMediaMessage = async (params: SendMessageParams): Promise<boolean> => {
  try {
    const config = getConfig();
    const normalizedPhone = params.to.replace(/\D/g, '');
    
    // Exemplo para Evolution API
    const endpoint = `/message/sendMedia/${config.instanceName}`;
    const body = {
      number: normalizedPhone,
      mediatype: params.type || 'image',
      media: params.mediaUrl,
      caption: params.message || '',
    };
    
    await makeRequest(endpoint, 'POST', body);
    return true;
  } catch (error) {
    console.error('Erro ao enviar mídia:', error);
    return false;
  }
};

// Verificar status da conexão
export const checkConnectionStatus = async (): Promise<boolean> => {
  try {
    const config = getConfig();
    const endpoint = `/instance/connectionState/${config.instanceName}`;
    const data = await makeRequest(endpoint);
    
    // Ajuste conforme a resposta da sua API
    return data?.state === 'open' || data?.status === 'connected' || data?.connected === true;
  } catch (error) {
    console.error('Erro ao verificar conexão:', error);
    return false;
  }
};

// Buscar informações de um contato específico
export const getContactInfo = async (phoneNumber: string): Promise<WhatsAppContact | null> => {
  try {
    const config = getConfig();
    const normalizedPhone = phoneNumber.replace(/\D/g, '');
    
    const endpoint = `/chat/fetchProfilePictureUrl/${config.instanceName}/${normalizedPhone}`;
    const data = await makeRequest(endpoint);
    
    return {
      id: normalizedPhone,
      name: data.name || normalizedPhone,
      phone: normalizedPhone,
      profilePicture: data.profilePicture || data.url,
    };
  } catch (error) {
    console.error('Erro ao buscar informações do contato:', error);
    return null;
  }
};

