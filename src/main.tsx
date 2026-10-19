import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { StoreSettingsProvider } from './context/StoreSettingsContext';
import { CustomPagesProvider } from './context/CustomPagesContext';
import { SuccessModalProvider } from './context/SuccessModalContext';
import { ErrorBoundary } from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <StoreSettingsProvider>
      <CustomPagesProvider>
        <SuccessModalProvider>
          <App />
        </SuccessModalProvider>
      </CustomPagesProvider>
    </StoreSettingsProvider>
  </ErrorBoundary>
);
