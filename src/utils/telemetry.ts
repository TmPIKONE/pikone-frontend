interface FrontendErrorContext {
  componentStack?: string;
  source?: string;
}

type TelemetryPayload =
  | {
      type: 'frontend_error';
      name: string;
      message: string;
      stack?: string;
      componentStack?: string;
      source?: string;
      path: string;
    }
  | {
      type: 'web_vital';
      id: string;
      name: string;
      value: number;
      rating: string;
      navigationType: string;
      path: string;
    };

const TELEMETRY_URL = import.meta.env.VITE_TELEMETRY_URL?.trim();
const MAX_MESSAGE_LENGTH = 600;
const MAX_STACK_LENGTH = 4000;

const trimForTelemetry = (value: string | undefined, maxLength: number) =>
  value ? value.slice(0, maxLength) : undefined;

export const sendTelemetry = (payload: TelemetryPayload) => {
  if (!TELEMETRY_URL || typeof window === 'undefined') return;

  const body = JSON.stringify({ ...payload, occurredAt: new Date().toISOString() });

  if (typeof navigator.sendBeacon === 'function') {
    const queued = navigator.sendBeacon(
      TELEMETRY_URL,
      new Blob([body], { type: 'application/json' }),
    );
    if (queued) return;
  }

  void fetch(TELEMETRY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    credentials: 'omit',
    keepalive: true,
  }).catch(() => undefined);
};

export const reportFrontendError = (error: unknown, context: FrontendErrorContext = {}) => {
  const normalizedError = error instanceof Error ? error : new Error(String(error));

  if (import.meta.env.DEV) {
    console.error('[PIKONE.ERROR]', normalizedError, context);
  }

  sendTelemetry({
    type: 'frontend_error',
    name: normalizedError.name,
    message: trimForTelemetry(normalizedError.message, MAX_MESSAGE_LENGTH) ?? 'Unknown error',
    stack: trimForTelemetry(normalizedError.stack, MAX_STACK_LENGTH),
    componentStack: trimForTelemetry(context.componentStack, MAX_STACK_LENGTH),
    source: trimForTelemetry(context.source, 120),
    path: window.location.pathname,
  });
};

export const startGlobalErrorReporting = () => {
  const handleError = (event: ErrorEvent) => {
    reportFrontendError(event.error ?? event.message, { source: 'window_error' });
  };
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    reportFrontendError(event.reason, { source: 'unhandled_rejection' });
  };

  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  return () => {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  };
};
