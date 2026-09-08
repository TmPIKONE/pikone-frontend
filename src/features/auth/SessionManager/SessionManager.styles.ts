import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.surface};
  box-shadow: ${theme.shadows.card};
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Title = styled.h2`
  font-size: 16px;
  font-weight: ${theme.fontWeights.semibold};
`;

export const Hint = styled.p`
  color: ${theme.colors.textMuted};
  font-size: ${theme.fontSizes.xs};
  line-height: 1.5;
  word-break: keep-all;
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Item = styled.li`
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: ${theme.radius.md};
  background: ${theme.colors.surfaceSubtle};
`;

export const DeviceInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DeviceNameRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
`;

export const DeviceName = styled.strong`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
`;

export const CurrentBadge = styled.span`
  padding: 3px 7px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.primaryLight};
  color: ${theme.colors.primaryDark};
  font-size: 10px;
  font-weight: ${theme.fontWeights.semibold};
`;

export const LastActive = styled.span`
  color: ${theme.colors.gray500};
  font-size: ${theme.fontSizes.xs};
`;

export const RevokeButton = styled.button`
  flex: 0 0 auto;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.white};
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};

  &:disabled {
    opacity: 0.55;
  }
`;

export const Status = styled.p`
  padding: 10px 0;
  color: ${theme.colors.textMuted};
  font-size: ${theme.fontSizes.sm};
  line-height: 1.5;
`;

export const RetryButton = styled.button`
  align-self: flex-start;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.white};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
`;
