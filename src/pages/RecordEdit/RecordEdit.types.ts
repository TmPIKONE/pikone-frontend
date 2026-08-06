import type { RecordDetailResponse } from '~/apis/record/record.types';

export interface RecordEditFormProps {
  record: RecordDetailResponse;
  fallbackDate: string;
}
