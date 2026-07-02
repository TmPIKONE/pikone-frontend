import ApiBuilder from '../config/ApiBuilder';
import type { CalendarResponse, RecordDetailResponse } from './record.types';

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
