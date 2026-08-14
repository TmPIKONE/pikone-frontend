import * as S from './LoadingSpinner.styles';

interface LoadingSpinnerProps {
  label?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({
  label = '불러오는 중이에요',
  fullScreen = false,
}: LoadingSpinnerProps) => (
  <S.Wrapper $fullScreen={fullScreen} role="status" aria-live="polite">
    <S.Content>
      <S.Indicator aria-hidden="true" />
      <span>{label}</span>
    </S.Content>
  </S.Wrapper>
);

export default LoadingSpinner;
