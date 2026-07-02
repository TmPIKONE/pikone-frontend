import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  padding: 20px 8px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MonthNavRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 4px;
`;

export const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: ${theme.colors.gray600};
  cursor: pointer;
  padding: 2px;
`;

export const MonthTitle = styled.h1`
  font-size: 16px;
  font-weight: ${theme.fontWeights.semibold};
`;

export const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 4px 10px;
  border-bottom: 1px solid ${theme.colors.gray200};
`;

export const WeekdayLabel = styled.span<{ $isSunday?: boolean; $isSaturday?: boolean }>`
  text-align: center;
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  color: ${({ $isSunday, $isSaturday }) =>
    $isSunday ? theme.colors.error : $isSaturday ? theme.colors.primary : theme.colors.gray500};
`;

export const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 0 2px;
`;

export const DayCell = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 4px 2px 0;
  border: none;
  background: none;
  cursor: pointer;
`;

export const DayNumberBadge = styled.span<{ $isToday: boolean; $isCurrentMonth: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  border-radius: ${theme.radius.full};
  font-size: ${theme.fontSizes.md};
  font-weight: ${({ $isToday }) => ($isToday ? theme.fontWeights.bold : theme.fontWeights.medium)};
  color: ${({ $isToday, $isCurrentMonth }) =>
    $isToday ? theme.colors.white : $isCurrentMonth ? theme.colors.black : theme.colors.gray400};
  background-color: ${({ $isToday }) => ($isToday ? theme.colors.gray600 : 'transparent')};
`;

export const DayPhotoSlot = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
`;

export const DayPhotoCard = styled.div`
  width: 100%;
  height: 100%;
  border-radius: ${theme.radius.sm};
  background-color: ${theme.colors.white};
  padding: 3px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
`;

export const DayThumbnail = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  object-fit: cover;
  display: block;
`;

export const EmptyState = styled.div`
  padding: 40px 0;
  text-align: center;
  color: ${theme.colors.gray500};
  font-size: ${theme.fontSizes.xs};
`;
