export interface MonthWheelValue {
  year: number;
  month: number;
}

export interface MonthWheelPickerProps extends MonthWheelValue {
  isOpen: boolean;
  onClose: () => void;
  onChange: (value: MonthWheelValue) => void;
}
