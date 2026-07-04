export interface Step1PhotoProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onLocationResolved: (latitude?: number, longitude?: number) => void;
  onNext: () => void;
}
