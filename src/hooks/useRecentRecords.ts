import { useMemo } from 'react';
import { useCalendar } from './useCalendar';
import type { CalendarResponse } from '~/apis/record/record.types';

const sortByVisitDateDesc = (records: CalendarResponse[]) =>
  [...records].sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

export const useRecentRecords = (limit = 3) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const query = useCalendar(year, month);

  const recentRecords = useMemo(() => {
    if (!query.data) return undefined;
    return sortByVisitDateDesc(query.data).slice(0, limit);
  }, [query.data, limit]);

  return { ...query, data: recentRecords };
};
