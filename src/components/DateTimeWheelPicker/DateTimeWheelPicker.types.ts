export interface DateTimeWheelPickerProps {
  isOpen: boolean;
  value: string;
  title?: string;
  ariaLabel?: string;
  actionLabel?: string;
  onClose: () => void;
  onChange: (value: string) => void;
  onClear?: () => void;
}
