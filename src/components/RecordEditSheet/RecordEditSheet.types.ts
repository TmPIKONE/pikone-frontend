import type { RecordDetailResponse } from '~/apis/record/record.types';

export interface RecordEditSheetProps {
  isOpen: boolean;
  record: RecordDetailResponse;
  fallbackDate: string;
  onClose: () => void;
  onSaved: (visitDate: string) => void;
}
