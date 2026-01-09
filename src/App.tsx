import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { AppRoutes } from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppRoutes />
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;

