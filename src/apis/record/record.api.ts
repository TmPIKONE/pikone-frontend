import ApiBuilder from '../config/ApiBuilder';
import type { CalendarResponse } from './record.types';

const RECORDS_CALENDAR = '/records/calendar';

export const getCalendarBuilder = (year: number, month: number) =>
  ApiBuilder.create<void, CalendarResponse[]>(RECORDS_CALENDAR)
    .setMethod('GET')
    .setParams({ year, month });
