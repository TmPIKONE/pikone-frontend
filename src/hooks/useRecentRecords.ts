import { useApiQuery } from '~/apis/config/ApiBuilder';
import { getCalendarBuilder } from '~/apis/record/record.api';
import type { CalendarResponse } from '~/apis/record/record.types';

const sortByVisitDateDesc = (records: CalendarResponse[]) =>
  [...records].sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

export const useRecentRecords = (limit = 3) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  return useApiQuery<void, CalendarResponse[], CalendarResponse[]>(
    getCalendarBuilder(year, month),
    ['records', 'calendar', year, month],
    {
      select: (records) => sortByVisitDateDesc(records).slice(0, limit),
    },
  );
};
