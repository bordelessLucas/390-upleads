import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Buttom';
import { paths } from '../../routes/paths';
import reactLogo from '../../assets/react.svg';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(paths.dashboard);
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro ao fazer login. Tente novamente.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-gradient"></div>
        <div className="auth-pattern"></div>
      </div>
      
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <img src={reactLogo} alt="React Logo" className="logo-image" />
            <h1>4UpLeads</h1>
          </div>
          <p className="auth-subtitle">
            CRM Omnichannel para WhatsApp e Instagram
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            className="auth-button"
          >
            Entrar
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Não tem uma conta?{' '}
            <Link to={paths.register} className="auth-link">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

