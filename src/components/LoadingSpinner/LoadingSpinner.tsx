import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

interface LoadingSpinnerProps {
  label?: string;
  fullScreen?: boolean;
}

const Wrapper = styled.div<{ $fullScreen: boolean }>`
  min-height: ${({ $fullScreen }) => ($fullScreen ? '100dvh' : '160px')};
  display: grid;
  place-items: center;
  padding: 32px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: ${theme.colors.textMuted};
  font-size: ${theme.fontSizes.sm};
`;

const Indicator = styled.span`
  width: 28px;
  height: 28px;
  border: 3px solid ${theme.colors.primaryLight};
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: loading-spin 0.75s linear infinite;

  @keyframes loading-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingSpinner = ({
  label = '불러오는 중이에요',
  fullScreen = false,
}: LoadingSpinnerProps) => (
  <Wrapper $fullScreen={fullScreen} role="status" aria-live="polite">
    <Content>
      <Indicator aria-hidden="true" />
      <span>{label}</span>
    </Content>
  </Wrapper>
);

export default LoadingSpinner;
