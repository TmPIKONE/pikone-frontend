export const RECORD_VIEW_PATH = '/record/view';

const RECORD_VIEW_DATE_STORAGE_KEY = 'pikone.recordViewDate';
const RECORD_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface RecordViewLocationState {
  date?: string;
}

export const isRecordViewDate = (value: unknown): value is string =>
  typeof value === 'string' && RECORD_DATE_PATTERN.test(value);

export const createRecordViewState = (date: string): RecordViewLocationState => ({ date });

export const rememberRecordViewDate = (date: string) => {
  if (!isRecordViewDate(date) || typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(RECORD_VIEW_DATE_STORAGE_KEY, date);
  } catch {
    // Storage can be unavailable in restricted browser environments.
  }
};

export const resolveRecordViewDate = (state: unknown, legacyDate?: string | null) => {
  const stateDate =
    state && typeof state === 'object' && 'date' in state
      ? (state as RecordViewLocationState).date
      : undefined;

  if (isRecordViewDate(stateDate)) return stateDate;
  if (isRecordViewDate(legacyDate)) return legacyDate;
  if (typeof window === 'undefined') return '';

  try {
    const storedDate = window.sessionStorage.getItem(RECORD_VIEW_DATE_STORAGE_KEY);
    return isRecordViewDate(storedDate) ? storedDate : '';
  } catch {
    return '';
  }
};
