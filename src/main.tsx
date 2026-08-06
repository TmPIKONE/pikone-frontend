import { createRoot } from 'react-dom/client';
import App from './App';
import { startWebVitalsReporting } from './utils/reportWebVitals';
import { startGlobalErrorReporting } from './utils/telemetry';

const stopGlobalErrorReporting = startGlobalErrorReporting();
createRoot(document.getElementById('root')!).render(<App />);

void startWebVitalsReporting();

if (import.meta.hot) {
  import.meta.hot.dispose(stopGlobalErrorReporting);
}
