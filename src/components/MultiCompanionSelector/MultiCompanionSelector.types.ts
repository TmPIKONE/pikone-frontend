export interface MultiCompanionSelectorProps {
  value: number[];
  onChange: (companionIds: number[]) => void;
  compact?: boolean;
  className?: string;
}
