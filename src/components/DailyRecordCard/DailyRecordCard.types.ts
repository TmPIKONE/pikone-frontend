import type { RecordDetailResponse } from '~/apis/record/record.types';

export interface DailyRecordCardProps {
  record: RecordDetailResponse;
  visitDate: string;
  onClick: () => void;
}
