export interface PhotoStepProps {
  file: File | null;
  isLocationResolved: boolean;
  onFileChange: (file: File | null) => void;
  onLocationResolved: (latitude?: number, longitude?: number) => void;
  onNext: () => void;
}
