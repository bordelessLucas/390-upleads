import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SideBarContext';
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

