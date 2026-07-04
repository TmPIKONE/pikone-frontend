export interface ImageUploaderProps {
  file: File | null;
  onChange: (file: File | null) => void;
  className?: string;
}
