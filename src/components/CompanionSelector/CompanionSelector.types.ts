export interface CompanionSelectorProps {
  value: number | null;
  onChange: (companionId: number | null) => void;
  className?: string;
}
