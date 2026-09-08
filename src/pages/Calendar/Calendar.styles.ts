import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  min-height: 100dvh;
  padding: calc(env(safe-area-inset-top, 0px) + 30px) ${theme.app.pagePadding} 80px;
  background: ${theme.colors.white};
`;

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
`;

export const PageTitle = styled.h1`
  color: ${theme.colors.black};
  font-size: 30px;
  font-weight: 950;
  letter-spacing: -0.06em;
`;

export const TodayButton = styled.button`
  min-height: 42px;
  color: ${theme.colors.gray400};
  font-size: 13px;
  font-weight: 800;
`;

export const StickyControls = styled.section`
  position: sticky;
  top: 0;
  z-index: 45;
  margin: 30px calc(${theme.app.pagePadding} * -1) 0;
  padding: 11px ${theme.app.pagePadding} 15px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
`;

export const MonthRow = styled.div`
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
`;

export const MonthButton = styled.button`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  color: ${theme.colors.gray300};
`;

export const MonthTitle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: ${theme.colors.black};
  font-size: 28px;
  font-weight: 950;
  letter-spacing: -0.045em;

  &:focus-visible {
    outline: 2px solid ${theme.colors.black};
    outline-offset: 5px;
    border-radius: ${theme.radius.sm};
  }
`;

export const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
`;

export const FilterButton = styled.button<{ $active: boolean }>`
  min-height: 47px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border-radius: ${theme.radius.full};
  background: ${({ $active }) => ($active ? theme.colors.black : theme.colors.gray100)};
  color: ${({ $active }) => ($active ? theme.colors.white : theme.colors.black)};
  font-size: 12px;
  font-weight: 850;

  i {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #55d887;
  }

  i.revisit {
    background: #ef6675;
  }
`;

export const ViewToggle = styled.button<{ $feed: boolean }>`
  width: 47px;
  height: 47px;
  flex: 0 0 47px;
  display: grid;
  place-items: center;
  margin-left: auto;
  border-radius: 16px;
  background: ${({ $feed }) => ($feed ? theme.colors.black : theme.colors.gray100)};
  color: ${({ $feed }) => ($feed ? theme.colors.white : theme.colors.black)};

  &:active {
    transform: scale(0.96);
  }
`;

export const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  margin-top: 22px;
`;

export const WeekdayLabel = styled.span`
  color: ${theme.colors.gray400};
  font-size: 12px;
  font-weight: 850;
  text-align: center;
`;

export const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  row-gap: 25px;
  margin-top: 24px;
`;

export const FeedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 3px;
  margin: 3px calc(${theme.app.pagePadding} * -1) 0;
  background: ${theme.colors.white};
`;

export const FeedItem = styled.button`
  position: relative;
  min-width: 0;
  overflow: hidden;
  aspect-ratio: 3 / 4;
  background: ${theme.colors.gray100};

  &:active {
    opacity: 0.82;
  }
`;

export const FeedImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

export const FeedDate = styled.span`
  position: absolute;
  top: 7px;
  left: 8px;
  z-index: 2;
  color: #111111;
  font-size: 14px;
  font-weight: 850;
  line-height: 1;
`;

export const DayCell = styled.button<{ $currentMonth: boolean }>`
  position: relative;
  min-width: 0;
  min-height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  opacity: ${({ $currentMonth }) => ($currentMonth ? 1 : 0.2)};
`;

export const TodayBadge = styled.span`
  position: absolute;
  top: -20px;
  z-index: 3;
  min-height: 22px;
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 8px;
  font-weight: 850;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -4px;
    width: 8px;
    height: 8px;
    background: ${theme.colors.black};
    transform: translateX(-50%) rotate(45deg);
  }
`;

export const DayCircle = styled.span<{ $selected: boolean; $hasRecord: boolean }>`
  position: relative;
  width: clamp(42px, 11.5vw, 53px);
  height: clamp(42px, 11.5vw, 53px);
  overflow: hidden;
  display: grid;
  place-items: center;
  border: ${({ $selected }) => ($selected ? `3px solid ${theme.colors.black}` : '3px solid transparent')};
  border-radius: 50%;
  background: ${({ $hasRecord }) => ($hasRecord ? theme.colors.white : theme.colors.gray100)};
  color: ${theme.colors.black};
  font-size: 13px;
  font-weight: 900;
`;

export const DayImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const DayNumber = styled.span`
  position: relative;
  z-index: 1;
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.66);
  color: ${theme.colors.white};
  font-size: 9px;
  font-weight: 900;
`;

export const DayMark = styled.span`
  color: ${theme.colors.gray300};
  font-size: 9px;
  font-weight: 900;
`;

export const EmptyState = styled.div`
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${theme.colors.gray400};
  font-size: 12px;

  button {
    min-height: 42px;
    padding: 0 15px;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.black};
    color: ${theme.colors.white};
  }
`;

export const BottomActions = styled.div<{ $feed: boolean }>`
  position: fixed;
  left: 50%;
  bottom: calc(96px + env(safe-area-inset-bottom));
  z-index: 60;
  width: min(calc(100% - 32px), 448px);
  display: grid;
  grid-template-columns: 1fr 2.2fr;
  gap: 10px;
  padding: 8px;
  border-radius: 36px;
  transform: translateX(-50%);
`;

export const WriteButton = styled.button`
  min-height: 62px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.black};
  font-size: 13px;
  font-weight: 850;

  &:disabled {
    color: ${theme.colors.gray400};
    cursor: not-allowed;
  }
`;

export const ViewButton = styled.button<{ $wide?: boolean }>`
  min-height: 62px;
  grid-column: ${({ $wide }) => ($wide ? '1 / -1' : 'auto')};
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 13px;
  font-weight: 850;
`;

export const FeedWriteButton = styled(ViewButton)`
  grid-column: 2;
  width: min(130px, 100%);
  justify-self: end;

  &:disabled {
    background: ${theme.colors.gray200};
    color: ${theme.colors.gray400};
    cursor: not-allowed;
  }
`;
