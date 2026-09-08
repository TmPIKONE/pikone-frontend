import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  min-height: 100dvh;
  padding: calc(env(safe-area-inset-top, 0px) + 18px) ${theme.app.pagePadding} 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: ${theme.colors.white};
`;

export const HeaderRow = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const BackButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray900};
  cursor: pointer;

  &:active {
    transform: scale(0.96);
  }
`;

export const HeaderText = styled.div`
  min-width: 0;
  flex: 1;
`;

export const Title = styled.h1`
  margin-top: 3px;
  color: ${theme.colors.black};
  font-size: 22px;
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.045em;
`;

export const UsageStrip = styled.section<{ $exhausted: boolean }>`
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 13px 11px 15px;
  border-radius: 17px;
  background: ${({ $exhausted }) => ($exhausted ? theme.colors.gray900 : theme.colors.gray100)};
`;

export const UsageStripText = styled.div<{ $exhausted: boolean }>`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  color: ${({ $exhausted }) => ($exhausted ? theme.colors.white : theme.colors.gray900)};

  span {
    color: ${({ $exhausted }) => ($exhausted ? 'rgba(255, 255, 255, 0.58)' : theme.colors.gray500)};
    font-size: 9px;
    font-weight: 750;
  }

  strong {
    color: inherit;
    font-size: 12px;
    font-weight: 850;
  }
`;

export const UsageStripCount = styled.span<{ $exhausted: boolean }>`
  flex-shrink: 0;
  min-width: 42px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.radius.full};
  background: ${({ $exhausted }) =>
    $exhausted ? 'rgba(255, 255, 255, 0.12)' : theme.colors.white};
  color: ${({ $exhausted }) => ($exhausted ? theme.colors.white : theme.colors.gray900)};
  font-size: 11px;
  font-weight: 900;
`;

export const RefreshStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 42px;
  border-radius: ${theme.radius.md};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
  font-size: 11px;
  font-weight: 700;

  svg {
    animation: spin 0.9s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
  transition: opacity ${theme.motion.fast} ${theme.motion.easing};

  &[aria-busy='true'] {
    opacity: 0.55;
    pointer-events: none;
  }
`;

export const ResultCard = styled.article<{ $isTopPick?: boolean; $isSelected?: boolean }>`
  position: relative;
  padding: 18px;
  border: 1px solid
    ${({ $isTopPick, $isSelected }) =>
      $isSelected ? theme.colors.success : $isTopPick ? theme.colors.black : theme.colors.gray200};
  border-radius: ${({ $isTopPick }) => ($isTopPick ? '22px' : '18px')};
  background: ${theme.colors.white};
  box-shadow: ${({ $isTopPick }) => ($isTopPick ? '0 10px 28px rgba(17, 19, 24, 0.08)' : 'none')};
`;

export const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const PickLabel = styled.span<{ $isTopPick: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 25px;
  padding: 0 9px;
  border-radius: ${theme.radius.full};
  background: ${({ $isTopPick }) => ($isTopPick ? theme.colors.black : theme.colors.gray100)};
  color: ${({ $isTopPick }) => ($isTopPick ? theme.colors.white : theme.colors.gray700)};
  font-size: 10px;
  font-weight: 850;
`;

export const DistanceTag = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${theme.colors.gray500};
  font-size: 11px;
  font-weight: 750;
  white-space: nowrap;
`;

export const PlaceName = styled.h2`
  min-width: 0;
  margin: 14px 0 0;
  color: ${theme.colors.gray900};
  font-size: 21px;
  font-weight: 900;
  line-height: 1.28;
  letter-spacing: -0.045em;
`;

export const MenuSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 17px;
  padding: 13px 14px;
  border-radius: 15px;
  background: ${theme.colors.gray100};
`;

export const MenuLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: ${theme.colors.gray600};
  font-size: 10px;
  font-weight: 800;
`;

export const MenuKeywordRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const MenuKeyword = styled.strong`
  color: ${theme.colors.gray900};
  font-size: 14px;
  font-weight: 850;
  letter-spacing: -0.025em;

  & + &::before {
    content: '·';
    margin-right: 6px;
    color: ${theme.colors.gray400};
  }
`;

export const OneLineSummary = styled.p`
  overflow: hidden;
  margin: 14px 0 0;
  color: ${theme.colors.gray700};
  font-size: 13px;
  font-weight: 750;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Address = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  margin: 12px 0 0;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 500;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ActionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  gap: 8px;
  margin-top: 15px;
`;

export const SkipButton = styled.button`
  min-height: 44px;
  padding: 0 10px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.full};
  background: ${theme.colors.white};
  color: ${theme.colors.gray600};
  font-size: 10px;
  font-weight: 750;

  &:disabled {
    color: ${theme.colors.gray400};
    cursor: not-allowed;
  }
`;

export const MapButton = styled.button`
  min-height: 44px;
  padding: 0 14px;
  border: 0;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 11px;
  font-weight: 850;
  cursor: pointer;

  &:active {
    transform: scale(0.985);
  }
`;

export const SelectButton = styled.button<{ $selected: boolean }>`
  grid-column: 1 / -1;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid ${({ $selected }) => ($selected ? theme.colors.success : theme.colors.black)};
  border-radius: ${theme.radius.full};
  background: ${({ $selected }) => ($selected ? theme.colors.success : theme.colors.white)};
  color: ${({ $selected }) => ($selected ? theme.colors.white : theme.colors.black)};
  font-size: 11px;
  font-weight: 850;
  cursor: ${({ $selected }) => ($selected ? 'default' : 'pointer')};

  &:active {
    transform: ${({ $selected }) => ($selected ? 'none' : 'scale(0.985)')};
  }
`;

export const RetryButton = styled.button`
  width: 100%;
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 16px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.full};
  background: ${theme.colors.white};
  color: ${theme.colors.gray700};
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;

  &:active {
    background: ${theme.colors.gray100};
  }

  &:disabled {
    color: ${theme.colors.gray400};
    cursor: not-allowed;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 72px 12px;
  text-align: center;
`;

export const EmptyTitle = styled.strong`
  color: ${theme.colors.gray900};
  font-size: 15px;
  font-weight: 800;
`;

export const EmptyDescription = styled.span`
  color: ${theme.colors.gray500};
  font-size: 11px;
`;
