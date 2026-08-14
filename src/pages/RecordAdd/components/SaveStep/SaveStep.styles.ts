import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

export const PageTitle = styled.h1`
  color: ${theme.colors.black};
  font-size: clamp(30px, 8vw, 39px);
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.06em;
`;

export const PageDescription = styled.p`
  margin-top: -11px;
  color: ${theme.colors.gray400};
  font-size: 13px;
  font-weight: 650;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const AnalysisBanner = styled.div<{ $state: 'analyzing' | 'ready' | 'error' }>`
  min-height: 60px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  padding: 12px 16px;
  border-radius: 20px;
  background: ${({ $state }) => ($state === 'ready' ? '#EAF5F0' : theme.colors.gray100)};
`;

export const Spinner = styled.div`
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  border: 2px solid ${theme.colors.gray300};
  border-top-color: ${theme.colors.black};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

export const AnalysisText = styled.span`
  min-width: 0;
  flex: 1;
  color: ${theme.colors.gray700};
  font-size: 12px;
  font-weight: 700;
`;

export const UseAnalysisButton = styled.button`
  min-height: 38px;
  padding: 0 13px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
`;

export const RetryButton = styled.button`
  min-height: 38px;
  padding: 0 13px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.white};
  color: ${theme.colors.black};
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

export const AutoCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 26px;
  background: ${theme.colors.white};
`;

export const AutoCardHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: ${theme.colors.accent};
    font-size: 12px;
    font-weight: 850;
  }

  small {
    color: ${theme.colors.gray400};
    font-size: 9px;
    font-weight: 700;
  }
`;

export const Label = styled.label`
  color: ${theme.colors.gray500};
  font-size: 14px;
  font-weight: 800;
`;

export const Input = styled.input`
  width: 100%;
  min-height: 60px;
  padding: 0 18px;
  border: 0;
  border-radius: 20px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.black};
  font-size: 16px;
  font-weight: 700;

  &::placeholder {
    color: ${theme.colors.gray400};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.black};
    outline-offset: 0;
  }
`;

export const StatusBox = styled.div`
  padding: 24px 0;
  color: ${theme.colors.gray400};
  font-size: 12px;
  font-weight: 650;
  text-align: center;
`;

export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Tag = styled.span`
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  padding: 0 15px;
  border-radius: ${theme.radius.full};
  background: #eaf2fb;
  color: #78a8dc;
  font-size: 12px;
  font-weight: 800;
`;

export const RestaurantList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RestaurantCard = styled.button<{ $selected: boolean }>`
  min-height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 13px 17px;
  border-radius: 20px;
  background: ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.gray100)};
  color: ${({ $selected }) => ($selected ? theme.colors.white : theme.colors.black)};
  text-align: left;
`;

export const RestaurantName = styled.span`
  font-size: 14px;
  font-weight: 850;
`;

export const RestaurantMeta = styled.span`
  overflow: hidden;
  color: inherit;
  font-size: 10px;
  font-weight: 600;
  opacity: 0.6;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EmptyRestaurantBox = styled.div`
  padding: 22px;
  border-radius: 20px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray500};
  font-size: 11px;
  font-weight: 650;
  line-height: 1.5;
  text-align: center;
`;

export const DatePickerButton = styled.button`
  width: 100%;
  min-height: 60px;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 22px;
  align-items: center;
  gap: 10px;
  padding: 0 16px 0 12px;
  border-radius: 20px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.black};
  font-size: 14px;
  font-weight: 800;
  text-align: left;

  &:focus-visible {
    outline: 2px solid ${theme.colors.black};
  }
`;

export const DateIcon = styled.span`
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: ${theme.colors.white};
`;

export const CapacityText = styled.p<{ $isFull: boolean }>`
  margin: -2px 2px 0;
  color: ${({ $isFull }) => ($isFull ? theme.colors.error : theme.colors.gray500)};
  font-size: 10px;
  font-weight: 700;
  line-height: 1.45;
`;

export const LocationTypeRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
`;

export const LocationTypeChip = styled.button<{ $active: boolean }>`
  min-height: 46px;
  border: 1px solid ${({ $active }) => ($active ? theme.colors.black : theme.colors.gray200)};
  border-radius: 15px;
  background: ${({ $active }) => ($active ? theme.colors.black : theme.colors.white)};
  color: ${({ $active }) => ($active ? theme.colors.white : theme.colors.gray700)};
  font-size: 11px;
  font-weight: 800;
`;

export const OptionsCard = styled.section`
  overflow: hidden;
  padding: 0 16px;
  border-radius: 22px;
  background: ${theme.colors.gray100};
`;

export const ToggleRow = styled.div`
  min-height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1px;
  border-bottom: 1px solid ${theme.colors.white};

  &:last-child {
    border-bottom: 0;
  }
`;

export const ToggleCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;

  > span {
    color: ${theme.colors.gray700};
    font-size: 14px;
    font-weight: 750;
  }
`;

export const ToggleLabel = styled.span`
  color: ${theme.colors.black};
  font-size: 14px;
  font-weight: 750;
`;

export const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px;
  margin-top: 20px;
`;

export const BackButton = styled.button`
  min-height: 62px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.black};
  font-size: 14px;
  font-weight: 800;
`;

export const SaveButton = styled.button`
  min-height: 62px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 14px;
  font-weight: 850;
  line-height: 1.25;

  &:disabled {
    background: ${theme.colors.gray100};
    color: ${theme.colors.gray400};
  }
`;
