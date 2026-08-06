export interface HomeDatePickerProps {
  isOpen: boolean;
  selectedDate: string;
  title?: string;
  ariaLabel?: string;
  actionLabel?: string;
  onClose: () => void;
  onDateChange: (date: string) => void;
}
