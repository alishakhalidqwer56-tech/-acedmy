import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { SiteProvider } from './context/SiteContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <SiteProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </SiteProvider>
  </AuthProvider>
);

