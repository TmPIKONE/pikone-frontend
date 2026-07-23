export interface HomeDatePickerProps {
  isOpen: boolean;
  selectedDate: string;
  onClose: () => void;
  onDateChange: (date: string) => void;
}
