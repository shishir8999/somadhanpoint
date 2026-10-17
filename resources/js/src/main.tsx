import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { StoreSettingsProvider } from './context/StoreSettingsContext';
import { CustomPagesProvider } from './context/CustomPagesContext';

createRoot(document.getElementById('root')!).render(
  <StoreSettingsProvider>
    <CustomPagesProvider>
      <App />
    </CustomPagesProvider>
  </StoreSettingsProvider>
);
