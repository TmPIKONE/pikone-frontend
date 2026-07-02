import { useApiQuery } from '~/apis/config/ApiBuilder';
import { getCalendarBuilder } from '~/apis/record/record.api';
import type { CalendarResponse } from '~/apis/record/record.types';

export const useCalendar = (year: number, month: number) => {
  return useApiQuery<void, CalendarResponse[]>(getCalendarBuilder(year, month), [
    'records',
    'calendar',
    year,
    month,
  ]);
};
