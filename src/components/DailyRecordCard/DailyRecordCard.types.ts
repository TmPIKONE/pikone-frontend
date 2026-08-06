import type { RecordDetailResponse } from '~/apis/record/record.types';

export interface DailyRecordCardProps {
  record: RecordDetailResponse;
  slotLabel: string;
  slotEmoji: string;
  onClick: () => void;
}
