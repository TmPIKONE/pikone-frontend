import type { DraftResponse } from '~/apis/draft/draft.types';

export interface DraftCardProps {
  draft: DraftResponse;
  onClick: () => void;
}
