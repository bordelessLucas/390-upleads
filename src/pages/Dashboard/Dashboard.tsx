import { useSidebar } from '../../contexts/SideBarContext';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { 
  FaComments, 
  FaUsers, 
  FaDollarSign, 
  FaChartBar, 
  FaCalendar, 
  FaBullseye
} from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { isOpen } = useSidebar();

  const stats = [
    {
      title: 'Conversas Hoje',
      value: '124',
      change: '+12%',
      icon: FaComments,
      color: '#646cff'
    },
    {
      title: 'Leads Qualificados',
      value: '48',
      change: '+8%',
      icon: FaUsers,
      color: '#7c84ff'
    },
    {
      title: 'Vendas do Mês',
      value: 'R$ 45.2k',
      change: '+23%',
      icon: FaDollarSign,
      color: '#8c94ff'
    },
    {
      title: 'Taxa de Conversão',
      value: '32%',
      change: '+5%',
      icon: FaChartBar,
      color: '#646cff'
    }
  ];

  const recentConversations = [
    { id: 1, name: 'Maria Silva', platform: 'WhatsApp', lastMessage: 'Olá, gostaria de mais informações...', time: '2 min', status: 'new' },
    { id: 2, name: 'João Santos', platform: 'Instagram', lastMessage: 'Qual o prazo de entrega?', time: '15 min', status: 'pending' },
    { id: 3, name: 'Ana Costa', platform: 'WhatsApp', lastMessage: 'Obrigada pelo atendimento!', time: '1h', status: 'resolved' },
    { id: 4, name: 'Pedro Lima', platform: 'Instagram', lastMessage: 'Preciso de suporte técnico', time: '2h', status: 'new' },
  ];

  const kanbanColumns = [
    { id: 'leads', title: 'Novos Leads', count: 12, color: '#646cff' },
    { id: 'qualificacao', title: 'Qualificação', count: 8, color: '#7c84ff' },
    { id: 'proposta', title: 'Proposta', count: 5, color: '#8c94ff' },
    { id: 'fechamento', title: 'Fechamento', count: 3, color: '#646cff' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-background">
        <div className="dashboard-gradient"></div>
      </div>

      <Header />
      
      <div className="dashboard-content">
        <Sidebar />

        <main className={`dashboard-main ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Dashboard</h1>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="stat-card">
                  <div className="stat-icon" style={{ color: stat.color }}>
                    <IconComponent />
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-title">{stat.title}</h3>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-change positive">{stat.change}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="dashboard-grid">
            {/* Recent Conversations */}
            <div className="dashboard-card conversations-card">
              <div className="card-header">
                <h2 className="card-title">Conversas Recentes</h2>
                <button className="card-action">Ver todas</button>
              </div>
              <div className="conversations-list">
                {recentConversations.map((conv) => (
                  <div key={conv.id} className="conversation-item">
                    <div className="conversation-avatar">
                      {conv.name.charAt(0)}
                    </div>
                    <div className="conversation-content">
                      <div className="conversation-header">
                        <span className="conversation-name">{conv.name}</span>
                        <span className="conversation-time">{conv.time}</span>
                      </div>
                      <div className="conversation-footer">
                        <span className={`conversation-platform platform-${conv.platform.toLowerCase()}`}>
                          {conv.platform}
                        </span>
                        <span className="conversation-message">{conv.lastMessage}</span>
                      </div>
                    </div>
                    <div className={`conversation-status status-${conv.status}`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kanban Funnel */}
            <div className="dashboard-card kanban-card">
              <div className="card-header">
                <h2 className="card-title">Funil de Vendas</h2>
                <button className="card-action">Ver completo</button>
              </div>
              <div className="kanban-board">
                {kanbanColumns.map((column) => (
                  <div key={column.id} className="kanban-column">
                    <div className="kanban-column-header">
                      <h3 className="kanban-column-title">{column.title}</h3>
                      <span className="kanban-count" style={{ backgroundColor: column.color }}>
                        {column.count}
                      </span>
                    </div>
                    <div className="kanban-items">
                      {Array.from({ length: Math.min(column.count, 3) }).map((_, i) => (
                        <div key={i} className="kanban-item">
                          <div className="kanban-item-content">
                            <div className="kanban-item-title">Lead #{i + 1}</div>
                            <div className="kanban-item-meta">Há {i + 1}h</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card actions-card">
              <div className="card-header">
                <h2 className="card-title">Ações Rápidas</h2>
              </div>
              <div className="actions-grid">
                <button className="action-button">
                  <span className="action-icon">
                    <FaCalendar />
                  </span>
                  <span className="action-label">Agendar Mensagem</span>
                </button>
                <button className="action-button">
                  <span className="action-icon">
                    <FaChartBar />
                  </span>
                  <span className="action-label">Relatórios</span>
                </button>
                <button className="action-button">
                  <span className="action-icon">
                    <FaBullseye />
                  </span>
                  <span className="action-label">Campanhas</span>
                </button>
                <button className="action-button">
                  <span className="action-icon">
                    <FaUsers />
                  </span>
                  <span className="action-label">Atendentes</span>
                </button>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="dashboard-card chart-card">
              <div className="card-header">
                <h2 className="card-title">Performance do Mês</h2>
                <select className="chart-period">
                  <option>Últimos 7 dias</option>
                  <option>Últimos 30 dias</option>
                  <option>Últimos 90 dias</option>
                </select>
              </div>
              <div className="chart-placeholder">
                <div className="chart-bars">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="chart-bar" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
                  ))}
                </div>
                <div className="chart-labels">
                  <span>Seg</span>
                  <span>Ter</span>
                  <span>Qua</span>
                  <span>Qui</span>
                  <span>Sex</span>
                  <span>Sáb</span>
                  <span>Dom</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

