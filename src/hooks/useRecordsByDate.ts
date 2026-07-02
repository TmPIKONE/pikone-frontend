import { useApiQuery } from '~/apis/config/ApiBuilder';
import { getRecordsByDateBuilder } from '~/apis/record/record.api';
import type { RecordDetailResponse } from '~/apis/record/record.types';

export const useRecordsByDate = (date: string) => {
  return useApiQuery<void, RecordDetailResponse[]>(
    getRecordsByDateBuilder(date),
    ['records', 'byDate', date],
    { enabled: !!date },
  );
};
