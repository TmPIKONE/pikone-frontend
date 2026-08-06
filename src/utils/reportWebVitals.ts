import type { Metric } from 'web-vitals';
import { sendTelemetry } from './telemetry';

const reportMetric = (metric: Metric) => {
  sendTelemetry({
    type: 'web_vital',
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    navigationType: metric.navigationType,
    path: window.location.pathname,
  });
};

export const startWebVitalsReporting = async () => {
  if (!import.meta.env.VITE_TELEMETRY_URL?.trim()) return;

  const { onCLS, onINP, onLCP } = await import('web-vitals');
  onCLS(reportMetric);
  onINP(reportMetric);
  onLCP(reportMetric);
};
