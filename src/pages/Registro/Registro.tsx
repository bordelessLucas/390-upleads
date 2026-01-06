import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Buttom';
import { paths } from '../../routes/paths';
import reactLogo from '../../assets/react.svg';
import './Registro.css';

const Registro = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, name);
      navigate(paths.dashboard);
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro ao criar conta. Tente novamente.';
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
            Crie sua conta e comece a gerenciar seus leads
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
              disabled={isLoading}
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite a senha novamente"
              required
              disabled={isLoading}
              minLength={6}
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
            Criar Conta
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Já tem uma conta?{' '}
            <Link to={paths.login} className="auth-link">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;

