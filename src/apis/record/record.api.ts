import ApiBuilder from '../config/ApiBuilder';
import type {
  CalendarResponse,
  RecordDetailResponse,
  AiFoodResponse,
  SaveRequest,
  SaveResponse,
  VisibilityRequest,
  VisibilityResponse,
  UpdateRecordRequest,
} from './record.types';

const RECORDS = '/records';
const RECORDS_ANALYZE = '/records/analyze';
const RECORDS_CALENDAR = '/records/calendar';
const RECORDS_CALENDAR_DETAIL = '/records/calendar/detail';

export const getCalendarBuilder = (year: number, month: number) =>
  ApiBuilder.create<void, CalendarResponse[]>(RECORDS_CALENDAR)
    .setMethod('GET')
    .setParams({ year, month });

export const getRecordsByDateBuilder = (date: string) =>
  ApiBuilder.create<void, RecordDetailResponse[]>(RECORDS_CALENDAR_DETAIL)
    .setMethod('GET')
    .setParams({ date });

export const analyzeImageBuilder = (latitude?: number, longitude?: number) =>
  ApiBuilder.create<FormData, AiFoodResponse>(RECORDS_ANALYZE)
    .setMethod('POST')
    .setParams({ latitude, longitude });

export const saveRecordBuilder = () =>
  ApiBuilder.create<SaveRequest, SaveResponse>(RECORDS).setMethod('POST');

export const updateRecordBuilder = (recordId: number) =>
  ApiBuilder.create<UpdateRecordRequest, void>(`${RECORDS}/${recordId}`).setMethod('PATCH');

export const deleteRecordBuilder = (recordId: number) =>
  ApiBuilder.create<void, void>(`${RECORDS}/${recordId}`).setMethod('DELETE');

export const updateVisibilityBuilder = (recordId: number) =>
  ApiBuilder.create<VisibilityRequest, VisibilityResponse>(
    `${RECORDS}/${recordId}/visibility`,
  ).setMethod('PATCH');
