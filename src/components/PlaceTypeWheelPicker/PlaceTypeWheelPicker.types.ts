export interface PlaceTypeOption {
  value: string;
  label: string;
}

export interface PlaceTypeWheelPickerProps {
  value: string;
  options: readonly PlaceTypeOption[];
  onChange: (value: string) => void;
  title?: string;
  ariaLabel?: string;
}
