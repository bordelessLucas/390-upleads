import { useSidebar } from '../../../contexts/SideBarContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { paths } from '../../../routes/paths';
import './Sidebar.css';

const Sidebar = () => {
  const { isOpen, closeSidebar } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'home',
      label: 'Início',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      path: paths.dashboard
    },  
    {
      id: 'UserProfile',
      label: 'Perfil do Usuário',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      path: '/UserProfile'
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      path: '/settings'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={closeSidebar}
      ></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

