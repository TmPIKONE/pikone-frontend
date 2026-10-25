import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  min-height: 100dvh;
  padding: calc(env(safe-area-inset-top, 0px) + 18px) ${theme.app.pagePadding} 34px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-x: hidden;
  background: ${theme.colors.white};
`;

export const HeaderRow = styled.header`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

export const BackButton = styled.button`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray900};
`;

export const HeaderText = styled.div`
  min-width: 0;
  flex: 1;
`;

export const Title = styled.h1`
  margin: 4px 0 0;
  color: ${theme.colors.black};
  font-size: 24px;
  font-weight: 900;
  line-height: 1.22;
  letter-spacing: -0.045em;
`;

export const HeaderSub = styled.p`
  margin: 6px 0 0;
  color: ${theme.colors.gray500};
  font-size: 13px;
  font-weight: 650;
  line-height: 1.45;
`;

export const ContextSummary = styled.div`
  min-width: 0;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 12px 0 14px;
  border-radius: 14px;
  background: ${theme.colors.gray100};

  span {
    min-width: 0;
    overflow: hidden;
    color: ${theme.colors.gray700};
    font-size: 13px;
    font-weight: 750;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  button {
    min-height: 36px;
    flex-shrink: 0;
    padding: 0 8px;
    color: ${theme.colors.gray700};
    font-size: 12px;
    font-weight: 850;
  }
`;

export const RefreshStatus = styled.div`
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 14px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
  font-size: 12px;
  font-weight: 750;
  text-align: center;
`;

export const FocusedResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  &[aria-busy='true'] {
    opacity: 0.55;
    pointer-events: none;
  }
`;

export const ResultSectionLabel = styled.strong`
  margin: 4px 2px -2px;
  color: ${theme.colors.gray700};
  font-size: 14px;
  font-weight: 900;
`;

export const ResultCard = styled.article`
  min-width: 0;
  overflow: hidden;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 22px;
  background: ${theme.colors.white};
`;

export const CardMedia = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 240px;
  overflow: hidden;
  background: ${theme.colors.gray100};

  > img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
`;

export const CardBody = styled.div`
  min-width: 0;
  padding: 18px;

  @media (max-width: 360px) {
    padding: 15px;
  }
`;

export const BadgeRow = styled.div`
  min-height: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
`;

export const PickBadge = styled.span`
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray700};
  font-size: 11px;
  font-weight: 850;
`;

export const SelectedBadge = styled(PickBadge)`
  background: ${theme.colors.black};
  color: ${theme.colors.white};
`;

export const PlaceName = styled.h2`
  margin: 0;
  color: ${theme.colors.gray900};
  overflow-wrap: anywhere;
  word-break: keep-all;
  font-size: 22px;
  font-weight: 900;
  line-height: 1.3;
  letter-spacing: -0.04em;

  @media (max-width: 360px) {
    font-size: 20px;
  }
`;

export const CategoryText = styled.p`
  margin: 7px 0 0;
  color: ${theme.colors.gray500};
  font-size: 14px;
  font-weight: 700;
`;

export const MenuList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;

  li {
    min-width: 0;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }

  strong {
    min-width: 0;
    overflow-wrap: anywhere;
    color: ${theme.colors.gray900};
    font-size: 16px;
    font-weight: 850;
    line-height: 1.4;
  }

  span {
    flex-shrink: 0;
    color: ${theme.colors.gray700};
    font-size: 15px;
    font-weight: 800;
  }
`;

export const DistanceText = styled.p`
  margin: 10px 0 0;
  color: ${theme.colors.gray600};
  font-size: 14px;
  font-weight: 750;
`;

export const GroundedReason = styled.p`
  margin: 12px 0 0;
  color: ${theme.colors.gray700};
  font-size: 14px;
  font-weight: 700;
  line-height: 1.55;
  word-break: keep-all;
`;

export const ConditionWarning = styled.p`
  margin: 10px 0 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
  font-size: 12px;
  font-weight: 750;
  line-height: 1.5;
  word-break: keep-all;
`;

export const ReasonDetails = styled.details`
  margin-top: 12px;
  border-top: 1px solid ${theme.colors.gray100};

  summary {
    min-height: 42px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: ${theme.colors.gray500};
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }
  &[open] summary svg {
    transform: rotate(180deg);
  }

  > div {
    display: grid;
    gap: 6px;
    padding: 0 0 4px;
  }

  p {
    margin: 0;
    color: ${theme.colors.gray600};
    font-size: 12px;
    font-weight: 650;
    line-height: 1.5;
    word-break: keep-all;
  }
`;

export const CardActionRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
  margin-top: 17px;

  > button:only-child {
    grid-column: 1 / -1;
  }

  @media (max-width: 360px) {
    grid-template-columns: 1fr;

    > button {
      grid-column: 1;
    }
  }
`;

export const MapButton = styled.button`
  min-width: 0;
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 12px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.full};
  background: ${theme.colors.white};
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 900;
`;

export const SelectButton = styled.button`
  min-width: 0;
  min-height: 52px;
  padding: 0 12px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 14px;
  font-weight: 900;
`;

export const AlternativeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AlternativeButton = styled.button`
  width: 100%;
  min-width: 0;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 16px;
  background: ${theme.colors.white};
  text-align: left;

  > span {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  strong {
    overflow-wrap: anywhere;
    color: ${theme.colors.gray900};
    font-size: 15px;
    font-weight: 900;
    line-height: 1.35;
  }

  small {
    overflow: hidden;
    color: ${theme.colors.gray600};
    font-size: 13px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  b {
    flex-shrink: 0;
    color: ${theme.colors.gray500};
    font-size: 12px;
    font-weight: 750;
  }

  @media (max-width: 360px) {
    align-items: flex-start;
    flex-direction: column;

    b {
      align-self: flex-start;
    }
  }
`;

export const SecondaryArea = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 2px;
`;

export const UsageHint = styled.p`
  margin: 0;
  color: ${theme.colors.gray500};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.45;
  text-align: center;
`;

export const RetryButton = styled.button`
  width: 100%;
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.full};
  background: ${theme.colors.white};
  color: ${theme.colors.gray700};
  font-size: 14px;
  font-weight: 850;

  &:disabled {
    color: ${theme.colors.gray400};
  }
`;

export const MoreDetails = styled.details`
  border-top: 1px solid ${theme.colors.gray100};
  padding-top: 4px;

  summary {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    color: ${theme.colors.gray500};
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  &[open] summary svg {
    transform: rotate(180deg);
  }

  > div {
    display: grid;
    gap: 7px;
    padding-bottom: 4px;
  }

  button {
    min-height: 44px;
    border-radius: 12px;
    background: ${theme.colors.gray100};
    color: ${theme.colors.gray700};
    font-size: 13px;
    font-weight: 800;
  }

  button:disabled {
    color: ${theme.colors.gray400};
  }
`;

export const HistoryPanel = styled.div`
  max-height: 280px;
  overflow-y: auto;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 16px;
  background: ${theme.colors.white};
`;

export const HistoryItem = styled.button`
  width: 100%;
  min-height: 58px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;
  padding: 10px 12px;
  color: ${theme.colors.gray900};
  text-align: left;

  & + & {
    border-top: 1px solid ${theme.colors.gray100};
  }
  strong {
    font-size: 13px;
    font-weight: 900;
  }
  span {
    color: ${theme.colors.gray500};
    font-size: 11px;
    font-weight: 650;
  }
`;

export const HistoryEmpty = styled.div`
  padding: 18px;
  color: ${theme.colors.gray500};
  font-size: 12px;
  text-align: center;
`;

export const EmptyState = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  text-align: center;
`;

export const EmptyTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.gray900};
  font-size: 20px;
  font-weight: 900;
`;

export const EmptyDescription = styled.p`
  margin: 0 0 8px;
  color: ${theme.colors.gray500};
  font-size: 13px;
  font-weight: 650;
`;

export const SelectionPanel = styled.div`
  position: fixed;
  left: 50%;
  bottom: calc(${theme.app.bottomNavSpace} + 10px);
  z-index: 110;
  width: min(calc(100% - 24px), calc(${theme.app.maxWidth} - 24px));
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 20px;
  background: ${theme.colors.white};
  box-shadow: 0 12px 34px rgba(17, 19, 24, 0.16);
  transform: translateX(-50%);
  outline: none;
`;

export const PanelTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  span {
    color: ${theme.colors.gray500};
    font-size: 12px;
    font-weight: 800;
  }

  strong {
    overflow-wrap: anywhere;
    color: ${theme.colors.gray900};
    font-size: 18px;
    font-weight: 900;
    line-height: 1.3;
  }

  p {
    margin: 0;
    color: ${theme.colors.gray600};
    font-size: 12px;
    font-weight: 650;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }

  > button {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.gray100};
    color: ${theme.colors.gray700};
  }
`;

export const PanelPrimary = styled.button`
  min-height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 14px;
  font-weight: 900;
`;

export const PanelSecondary = styled.button`
  min-height: 44px;
  color: ${theme.colors.gray600};
  font-size: 13px;
  font-weight: 850;
`;

export const SelectionSheetContent = styled.div`
  display: grid;
  gap: 10px;
  padding-top: 4px;
`;

export const SelectionSummary = styled.div`
  display: grid;
  gap: 5px;
  padding: 4px 2px 8px;

  strong {
    overflow-wrap: anywhere;
    color: ${theme.colors.gray900};
    font-size: 20px;
    font-weight: 900;
    line-height: 1.3;
  }

  p {
    margin: 0;
    overflow-wrap: anywhere;
    color: ${theme.colors.gray600};
    font-size: 13px;
    font-weight: 650;
    line-height: 1.5;
  }
`;
