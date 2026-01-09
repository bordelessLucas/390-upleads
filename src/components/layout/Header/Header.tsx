import { useAuth } from '../../../contexts/AuthContext';
import { useSidebar } from '../../../contexts/SidebarContext';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import reactLogo from '../../../assets/react.svg';
import { paths } from '../../../routes/paths';
import './Header.css';

const Header = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(paths.login);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button 
            className="menu-toggle" 
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
          <div className="header-logo-container">
            <img src={reactLogo} alt="React Logo" className="header-logo-image" />
            <h1 className="header-logo">UpLeads</h1>
          </div>
        </div>
        
        <div className="header-right">
          {currentUser && (
            <>
              <div className="user-info">
                <div className="user-avatar">
                  {userProfile?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="user-name">
                  {userProfile?.displayName || currentUser?.email?.split('@')[0] || 'Usuário'}
                </span>
              </div>
              <button onClick={handleLogout} className="logout-button" aria-label="Logout">
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

