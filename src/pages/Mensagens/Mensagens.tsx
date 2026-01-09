import { useState, useEffect } from 'react';
import { useSidebar } from '../../contexts/SideBarContext';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { 
  FaSearch, 
  FaTimes, 
  FaPaperPlane, 
  FaImage, 
  FaMicrophone,
  FaWhatsapp,
  FaInstagram,
  FaEdit,
  FaCalendar,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaBan
} from 'react-icons/fa';
import { 
  getContacts, 
  getMessages, 
  sendTextMessage,
  type WhatsAppContact,
  type WhatsAppMessage 
} from '../../services/whatsappService';
import './Mensagens.css';

interface Cliente {
  id: string;
  nome: string;
  plataforma: 'whatsapp' | 'instagram';
  status: 'aberto' | 'pendente' | 'resolvido';
  ultimaMensagem: string;
  timestamp: string;
  avatar?: string;
  kanban?: string;
  informacoes?: {
    telefone?: string;
    email?: string;
    endereco?: string;
    notas?: string;
  };
}

interface Mensagem {
  id: string;
  texto: string;
  tipo: 'texto' | 'audio' | 'imagem';
  remetente: 'eu' | 'cliente';
  timestamp: string;
  urlImagem?: string;
  urlAudio?: string;
}

interface MensagemAgendada {
  id: string;
  texto: string;
  dataEnvio: string;
  tipo: 'texto' | 'audio' | 'imagem';
}

const Mensagens = () => {
  const { isOpen } = useSidebar();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'aberto' | 'pendente' | 'resolvido'>('aberto');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [editandoNome, setEditandoNome] = useState(false);
  const [nomeEditado, setNomeEditado] = useState('');
  const [editandoInfo, setEditandoInfo] = useState(false);
  const [infoEditada, setInfoEditada] = useState({ telefone: '', email: '', endereco: '', notas: '' });
  const [mostrarAgendamento, setMostrarAgendamento] = useState(false);
  const [mensagemAgendamento, setMensagemAgendamento] = useState({ texto: '', data: '', hora: '' });
  const [mensagensAgendadas, setMensagensAgendadas] = useState<MensagemAgendada[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingMensagens, setLoadingMensagens] = useState(false);

  // Estado para clientes (combina WhatsApp real + Instagram mockado)
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: '1',
      nome: 'Premium Imports',
      plataforma: 'whatsapp',
      status: 'aberto',
      ultimaMensagem: 'Olá, vim pelo site do Google e gostaria de saber mais sobre Tráfego Pago',
      timestamp: '20 minutos',
      kanban: 'Qualificação',
      informacoes: {
        telefone: '+55 11 99999-9999',
        email: 'contato@premiumimports.com',
        endereco: 'São Paulo, SP',
        notas: 'Cliente interessado em tráfego pago'
      }
    },
    {
      id: '2',
      nome: 'Frann',
      plataforma: 'instagram',
      status: 'aberto',
      ultimaMensagem: 'Qual o prazo de entrega?',
      timestamp: '2 horas',
      informacoes: {
        telefone: '+55 11 98888-8888',
        email: 'frann@example.com'
      }
    },
    {
      id: '3',
      nome: 'Juliane Martinez',
      plataforma: 'whatsapp',
      status: 'pendente',
      ultimaMensagem: 'Obrigada pelo atendimento!',
      timestamp: '1 dia',
      informacoes: {
        telefone: '+55 11 97777-7777'
      }
    },
    {
      id: '4',
      nome: 'Laercio Junior',
      plataforma: 'instagram',
      status: 'aberto',
      ultimaMensagem: 'Preciso de suporte técnico',
      timestamp: '3 horas',
      informacoes: {
        telefone: '+55 11 96666-6666',
        email: 'laercio@example.com'
      }
    },
    {
      id: '5',
      nome: 'Atelie Moreira CRM',
      plataforma: 'whatsapp',
      status: 'resolvido',
      ultimaMensagem: 'Perfeito, vou aguardar',
      timestamp: '2 dias',
      informacoes: {
        telefone: '+55 11 95555-5555',
        email: 'contato@ateliermoreira.com'
      }
    }
  ]);

  // Estado para mensagens (combina WhatsApp real + Instagram mockado)
  const [mensagens, setMensagens] = useState<{ [key: string]: Mensagem[] }>({
    // Mensagens mockadas para clientes Instagram (mantém compatibilidade)
    '2': [],
    '4': []
  });

  // Função para converter WhatsAppContact para Cliente
  const convertWhatsAppContactToCliente = (contact: WhatsAppContact): Cliente => {
    return {
      id: contact.id,
      nome: contact.name,
      plataforma: 'whatsapp',
      status: 'aberto', // Status padrão, pode ser ajustado
      ultimaMensagem: contact.lastMessage || '',
      timestamp: formatTimestamp(contact.lastMessageTime),
      avatar: contact.profilePicture,
      informacoes: {
        telefone: contact.phone
      }
    };
  };

  // Função para converter WhatsAppMessage para Mensagem
  const convertWhatsAppMessageToMensagem = (msg: WhatsAppMessage): Mensagem => {
    const timestamp = typeof msg.timestamp === 'number' 
      ? new Date(msg.timestamp * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return {
      id: msg.id,
      texto: msg.body || msg.caption || '',
      tipo: msg.type === 'image' ? 'imagem' : msg.type === 'audio' ? 'audio' : 'texto',
      remetente: msg.isFromMe ? 'eu' : 'cliente',
      timestamp: timestamp,
      urlImagem: msg.type === 'image' ? msg.mediaUrl : undefined,
      urlAudio: msg.type === 'audio' ? msg.mediaUrl : undefined
    };
  };

  // Função para formatar timestamp
  const formatTimestamp = (timestamp?: string | number): string => {
    if (!timestamp) return '';
    
    const date = typeof timestamp === 'number' 
      ? new Date(timestamp * 1000) 
      : new Date(timestamp);
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('pt-BR');
  };

  // Buscar contatos do WhatsApp ao carregar a página
  useEffect(() => {
    const fetchWhatsAppContacts = async () => {
      setLoadingClientes(true);
      try {
        const whatsappContacts = await getContacts();
        
        // Converte contatos do WhatsApp para o formato Cliente
        const clientesWhatsApp = whatsappContacts.map(convertWhatsAppContactToCliente);
        
        // Mantém clientes Instagram mockados e adiciona clientes do WhatsApp
        setClientes(prev => {
          const instagramClientes = prev.filter(c => c.plataforma === 'instagram');
          return [...clientesWhatsApp, ...instagramClientes];
        });
      } catch (error) {
        console.error('Erro ao buscar contatos do WhatsApp:', error);
        // Em caso de erro, mantém apenas os clientes mockados
      } finally {
        setLoadingClientes(false);
      }
    };

    fetchWhatsAppContacts();
  }, []);

  // Buscar mensagens quando um cliente WhatsApp é selecionado
  useEffect(() => {
    const fetchMessages = async () => {
      if (!clienteSelecionado || clienteSelecionado.plataforma !== 'whatsapp') {
        return;
      }

      setLoadingMensagens(true);
      try {
        const phoneNumber = clienteSelecionado.informacoes?.telefone || clienteSelecionado.id;
        const whatsappMessages = await getMessages(phoneNumber);
        
        // Converte mensagens do WhatsApp para o formato Mensagem
        const mensagensConvertidas = whatsappMessages.map(convertWhatsAppMessageToMensagem);
        
        setMensagens(prev => ({
          ...prev,
          [clienteSelecionado.id]: mensagensConvertidas
        }));
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
      } finally {
        setLoadingMensagens(false);
      }
    };

    fetchMessages();
  }, [clienteSelecionado?.id, clienteSelecionado?.plataforma]);

  const clientesFiltrados = clientes.filter(cliente => {
    const matchBusca = busca === '' || cliente.nome.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = cliente.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const mensagensCliente = clienteSelecionado ? (mensagens[clienteSelecionado.id] || []) : [];

  const handleSelecionarCliente = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setNomeEditado(cliente.nome);
    setInfoEditada({
      telefone: cliente.informacoes?.telefone || '',
      email: cliente.informacoes?.email || '',
      endereco: cliente.informacoes?.endereco || '',
      notas: cliente.informacoes?.notas || ''
    });
    setEditandoNome(false);
    setEditandoInfo(false);
  };

  const handleEnviarMensagem = async () => {
    if (!novaMensagem.trim() || !clienteSelecionado) return;

    // Se for WhatsApp, envia pela API
    if (clienteSelecionado.plataforma === 'whatsapp') {
      try {
        const phoneNumber = clienteSelecionado.informacoes?.telefone || clienteSelecionado.id;
        const success = await sendTextMessage({
          to: phoneNumber,
          message: novaMensagem
        });

        if (success) {
          // Adiciona a mensagem localmente
          const novaMensagemObj: Mensagem = {
            id: `m${Date.now()}`,
            texto: novaMensagem,
            tipo: 'texto',
            remetente: 'eu',
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          };

          setMensagens(prev => ({
            ...prev,
            [clienteSelecionado.id]: [...(prev[clienteSelecionado.id] || []), novaMensagemObj]
          }));

          setNovaMensagem('');
        } else {
          alert('Erro ao enviar mensagem. Tente novamente.');
        }
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        alert('Erro ao enviar mensagem. Verifique a conexão com a API.');
      }
    } else {
      // Para Instagram (mockado), mantém comportamento anterior
      const novaMensagemObj: Mensagem = {
        id: `m${Date.now()}`,
        texto: novaMensagem,
        tipo: 'texto',
        remetente: 'eu',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMensagens(prev => ({
        ...prev,
        [clienteSelecionado.id]: [...(prev[clienteSelecionado.id] || []), novaMensagemObj]
      }));

      setNovaMensagem('');
    }
  };

  const handleSalvarNome = () => {
    if (clienteSelecionado && nomeEditado.trim()) {
      setClienteSelecionado({ ...clienteSelecionado, nome: nomeEditado });
      setEditandoNome(false);
    }
  };

  const handleSalvarInfo = () => {
    if (clienteSelecionado) {
      setClienteSelecionado({
        ...clienteSelecionado,
        informacoes: infoEditada
      });
      setEditandoInfo(false);
    }
  };

  const handleAgendarMensagem = () => {
    if (!mensagemAgendamento.texto.trim() || !mensagemAgendamento.data || !mensagemAgendamento.hora) {
      alert('Preencha todos os campos para agendar a mensagem');
      return;
    }

    const novaMensagemAgendada: MensagemAgendada = {
      id: `agendada-${Date.now()}`,
      texto: mensagemAgendamento.texto,
      dataEnvio: `${mensagemAgendamento.data}T${mensagemAgendamento.hora}:00`,
      tipo: 'texto'
    };

    setMensagensAgendadas([...mensagensAgendadas, novaMensagemAgendada]);
    setMensagemAgendamento({ texto: '', data: '', hora: '' });
    setMostrarAgendamento(false);
  };

  const handleCancelarAgendamento = (id: string) => {
    setMensagensAgendadas(mensagensAgendadas.filter(m => m.id !== id));
  };

  const handleAlterarStatus = (clienteId: string, novoStatus: 'aberto' | 'pendente' | 'resolvido') => {
    const clienteAtualizado = clientes.find(c => c.id === clienteId);
    if (clienteAtualizado) {
      clienteAtualizado.status = novoStatus;
      if (clienteSelecionado?.id === clienteId) {
        setClienteSelecionado({ ...clienteAtualizado });
      }
    }
  };

  return (
    <div className="mensagens-container">
      <Header />
      
      <div className="mensagens-content">
        <Sidebar />

        <div className={`mensagens-main ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="mensagens-layout">
            {/* Coluna Esquerda - Lista de Clientes */}
            <div className="clientes-panel">
              <div className="clientes-header">
                <h2>Conversas</h2>
              </div>

              <div className="clientes-search">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscando por id, nome ou número..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>

              <div className="clientes-filtros">
                <button
                  className={`filtro-btn ${filtroStatus === 'aberto' ? 'active' : ''}`}
                  onClick={() => setFiltroStatus('aberto')}
                >
                  ABERTOS
                  <span className="filtro-badge">{clientes.filter(c => c.status === 'aberto').length}</span>
                </button>
                <button
                  className={`filtro-btn ${filtroStatus === 'pendente' ? 'active' : ''}`}
                  onClick={() => setFiltroStatus('pendente')}
                >
                  PENDENTES
                  <span className="filtro-badge">{clientes.filter(c => c.status === 'pendente').length}</span>
                </button>
                <button
                  className={`filtro-btn ${filtroStatus === 'resolvido' ? 'active' : ''}`}
                  onClick={() => setFiltroStatus('resolvido')}
                >
                  RESOLVIDOS
                  <span className="filtro-badge">{clientes.filter(c => c.status === 'resolvido').length}</span>
                </button>
              </div>

              <div className="clientes-list">
                {loadingClientes && (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                    Carregando conversas...
                  </div>
                )}
                {!loadingClientes && clientesFiltrados.length === 0 && (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                    Nenhuma conversa encontrada
                  </div>
                )}
                {clientesFiltrados.map(cliente => (
                  <div
                    key={cliente.id}
                    className={`cliente-item ${clienteSelecionado?.id === cliente.id ? 'selected' : ''}`}
                    onClick={() => handleSelecionarCliente(cliente)}
                  >
                    <div className="cliente-avatar">
                      {cliente.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="cliente-info">
                      <div className="cliente-header">
                        <span className="cliente-nome">{cliente.nome}</span>
                        <span className="cliente-timestamp">{cliente.timestamp}</span>
                      </div>
                      <div className="cliente-footer">
                        <span className={`cliente-plataforma platform-${cliente.plataforma}`}>
                          {cliente.plataforma === 'whatsapp' ? <FaWhatsapp /> : <FaInstagram />}
                        </span>
                        <span className="cliente-mensagem">{cliente.ultimaMensagem}</span>
                      </div>
                    </div>
                    {cliente.status === 'aberto' && <div className="status-indicator status-aberto"></div>}
                    {cliente.status === 'pendente' && <div className="status-indicator status-pendente"></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Coluna Centro - Chat */}
            <div className="chat-panel">
              {clienteSelecionado ? (
                <>
                  <div className="chat-header">
                    <div className="chat-header-info">
                      <div className="chat-avatar">
                        {clienteSelecionado.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3>{clienteSelecionado.nome}</h3>
                        <p>
                          {clienteSelecionado.plataforma === 'whatsapp' ? <FaWhatsapp /> : <FaInstagram />}
                          {' '}Ticket #{clienteSelecionado.id} - {new Date().toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="chat-status-buttons">
                      <button
                        className={`status-btn ${clienteSelecionado.status === 'aberto' ? 'active' : ''}`}
                        onClick={() => handleAlterarStatus(clienteSelecionado.id, 'aberto')}
                      >
                        <FaCheckCircle /> Aberto
                      </button>
                      <button
                        className={`status-btn ${clienteSelecionado.status === 'pendente' ? 'active' : ''}`}
                        onClick={() => handleAlterarStatus(clienteSelecionado.id, 'pendente')}
                      >
                        <FaClock /> Pendente
                      </button>
                      <button
                        className={`status-btn ${clienteSelecionado.status === 'resolvido' ? 'active' : ''}`}
                        onClick={() => handleAlterarStatus(clienteSelecionado.id, 'resolvido')}
                      >
                        <FaBan /> Resolvido
                      </button>
                    </div>
                  </div>

                  <div className="chat-messages">
                    {loadingMensagens && (
                      <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                        Carregando mensagens...
                      </div>
                    )}
                    {!loadingMensagens && mensagensCliente.length === 0 && (
                      <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                        Nenhuma mensagem ainda
                      </div>
                    )}
                    {mensagensCliente.map(mensagem => (
                      <div key={mensagem.id} className={`message ${mensagem.remetente}`}>
                        <div className="message-content">
                          {mensagem.tipo === 'texto' && <p>{mensagem.texto}</p>}
                          {mensagem.tipo === 'imagem' && mensagem.urlImagem && (
                            <img src={mensagem.urlImagem} alt="Imagem enviada" />
                          )}
                          {mensagem.tipo === 'audio' && (
                            <div className="audio-message">
                              <FaMicrophone />
                              <span>Áudio</span>
                            </div>
                          )}
                          <span className="message-time">{mensagem.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="chat-input-area">
                    <div className="chat-input-buttons">
                      <button className="input-btn" title="Enviar imagem">
                        <FaImage />
                      </button>
                      <button className="input-btn" title="Enviar áudio">
                        <FaMicrophone />
                      </button>
                      <button 
                        className="input-btn" 
                        title="Agendar mensagem"
                        onClick={() => setMostrarAgendamento(true)}
                      >
                        <FaCalendar />
                      </button>
                    </div>
                    <div className="chat-input-wrapper">
                      <input
                        type="text"
                        placeholder="Digite sua mensagem..."
                        value={novaMensagem}
                        onChange={(e) => setNovaMensagem(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensagem()}
                      />
                      <button className="send-btn" onClick={handleEnviarMensagem}>
                        <FaPaperPlane />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="chat-empty">
                  <p>Selecione uma conversa para começar</p>
                </div>
              )}
            </div>

            {/* Coluna Direita - Informações do Cliente */}
            <div className="info-panel">
              {clienteSelecionado ? (
                <>
                  <div className="info-header">
                    <h3>Dados do Contato</h3>
                  </div>

                  <div className="info-section">
                    <div className="info-row">
                      <label>Nome</label>
                      {editandoNome ? (
                        <div className="edit-row">
                          <input
                            type="text"
                            value={nomeEditado}
                            onChange={(e) => setNomeEditado(e.target.value)}
                          />
                          <button className="save-btn" onClick={handleSalvarNome}>
                            <FaCheckCircle />
                          </button>
                          <button className="cancel-btn" onClick={() => setEditandoNome(false)}>
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="info-value">
                          <span>{clienteSelecionado.nome}</span>
                          <button className="edit-btn" onClick={() => setEditandoNome(true)}>
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="info-section-content">
                      <h4>Informações Gerais</h4>
                      {editandoInfo ? (
                        <div className="info-form">
                          <input
                            type="text"
                            placeholder="Telefone"
                            value={infoEditada.telefone}
                            onChange={(e) => setInfoEditada({ ...infoEditada, telefone: e.target.value })}
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={infoEditada.email}
                            onChange={(e) => setInfoEditada({ ...infoEditada, email: e.target.value })}
                          />
                          <input
                            type="text"
                            placeholder="Endereço"
                            value={infoEditada.endereco}
                            onChange={(e) => setInfoEditada({ ...infoEditada, endereco: e.target.value })}
                          />
                          <textarea
                            placeholder="Notas"
                            value={infoEditada.notas}
                            onChange={(e) => setInfoEditada({ ...infoEditada, notas: e.target.value })}
                          />
                          <div className="form-actions">
                            <button className="save-btn" onClick={handleSalvarInfo}>
                              Salvar
                            </button>
                            <button className="cancel-btn" onClick={() => setEditandoInfo(false)}>
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="info-item">
                            <span className="info-label">Telefone:</span>
                            <span className="info-text">{clienteSelecionado.informacoes?.telefone || '-'}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Email:</span>
                            <span className="info-text">{clienteSelecionado.informacoes?.email || '-'}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Endereço:</span>
                            <span className="info-text">{clienteSelecionado.informacoes?.endereco || '-'}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Notas:</span>
                            <span className="info-text">{clienteSelecionado.informacoes?.notas || '-'}</span>
                          </div>
                          <button className="edit-btn-full" onClick={() => setEditandoInfo(true)}>
                            <FaEdit /> Editar Informações
                          </button>
                        </>
                      )}
                    </div>

                    <div className="info-section-content">
                      <h4>Kanban</h4>
                      <select className="kanban-select">
                        <option value="">Selecione uma etapa</option>
                        <option value="novos-leads">Novos Leads</option>
                        <option value="qualificacao">Qualificação</option>
                        <option value="proposta">Proposta</option>
                        <option value="fechamento">Fechamento</option>
                      </select>
                      <button className="kanban-btn">
                        Salvar
                      </button>
                    </div>

                    <div className="info-section-content">
                      <h4>Mensagens Agendadas</h4>
                      {mensagensAgendadas.length === 0 ? (
                        <p className="no-scheduled">Nenhuma mensagem agendada</p>
                      ) : (
                        <div className="scheduled-messages">
                          {mensagensAgendadas.map(msg => (
                            <div key={msg.id} className="scheduled-item">
                              <div className="scheduled-text">{msg.texto}</div>
                              <div className="scheduled-date">
                                {new Date(msg.dataEnvio).toLocaleString('pt-BR')}
                              </div>
                              <button
                                className="cancel-scheduled-btn"
                                onClick={() => handleCancelarAgendamento(msg.id)}
                              >
                                <FaTrash /> Cancelar
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="info-empty">
                  <p>Selecione um cliente para ver as informações</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Agendamento */}
      {mostrarAgendamento && (
        <div className="modal-overlay" onClick={() => setMostrarAgendamento(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Agendar Mensagem</h3>
              <button className="modal-close" onClick={() => setMostrarAgendamento(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <textarea
                placeholder="Digite a mensagem que deseja agendar..."
                value={mensagemAgendamento.texto}
                onChange={(e) => setMensagemAgendamento({ ...mensagemAgendamento, texto: e.target.value })}
                rows={5}
              />
              <div className="schedule-datetime">
                <input
                  type="date"
                  value={mensagemAgendamento.data}
                  onChange={(e) => setMensagemAgendamento({ ...mensagemAgendamento, data: e.target.value })}
                />
                <input
                  type="time"
                  value={mensagemAgendamento.hora}
                  onChange={(e) => setMensagemAgendamento({ ...mensagemAgendamento, hora: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setMostrarAgendamento(false)}>
                  Cancelar
                </button>
                <button className="save-btn" onClick={handleAgendarMensagem}>
                  Agendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mensagens;

