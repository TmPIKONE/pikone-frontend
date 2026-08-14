import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Trigger = styled.button`
  width: 100%;
  min-height: 72px;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 24px;
  align-items: center;
  gap: 11px;
  padding: 12px 15px;
  border-radius: 20px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.black};
  text-align: left;

  &:focus-visible {
    outline: 2px solid ${theme.colors.black};
  }
`;

export const TriggerIcon = styled.span`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: ${theme.colors.white};
  color: ${theme.colors.black};
`;

export const TriggerCopy = styled.span`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TriggerName = styled.strong`
  overflow: hidden;
  font-size: 14px;
  font-weight: 850;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TriggerMeta = styled.span`
  overflow: hidden;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PickerDescription = styled.p`
  margin: 2px 0 12px;
  color: ${theme.colors.gray500};
  font-size: 12px;
  font-weight: 650;
  line-height: 1.5;
`;

export const SearchBox = styled.label`
  min-height: 52px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 15px;
  border-radius: 17px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray500};

  &:focus-within {
    outline: 2px solid ${theme.colors.black};
  }
`;

export const SearchInput = styled.input`
  min-width: 0;
  flex: 1;
  padding: 0;
  border: 0;
  outline: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  appearance: none;
  -webkit-appearance: none;

  color: ${theme.colors.black};
  font-size: 14px;
  font-weight: 700;

  &:focus,
  &:focus-visible {
    border: 0;
    outline: none;
    box-shadow: none;
  }

  &::placeholder {
    color: ${theme.colors.gray400};
  }
`;

export const ResultSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 13px 2px 8px;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 750;
`;

export const RestaurantList = styled.div`
  max-height: min(43dvh, 370px);
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding: 1px 2px 8px;
  overscroll-behavior: contain;
`;

export const RestaurantCard = styled.button<{ $selected: boolean }>`
  min-height: 76px;
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 28px;
  align-items: center;
  gap: 12px;
  padding: 13px 14px 13px 16px;
  border: 2px solid ${({ $selected }) => ($selected ? theme.colors.black : 'transparent')};
  border-radius: 20px;
  background: ${({ $selected }) => ($selected ? theme.colors.white : theme.colors.gray100)};
  color: ${theme.colors.black};
  text-align: left;
`;

export const RestaurantCopy = styled.span`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const NameRow = styled.span`
  display: flex;
  align-items: center;
  gap: 7px;
`;

export const RestaurantName = styled.strong`
  overflow: hidden;
  font-size: 14px;
  font-weight: 850;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RecommendBadge = styled.span`
  flex: 0 0 auto;
  min-height: 22px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 0 7px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 8px;
  font-weight: 850;
`;

export const RestaurantMeta = styled.span`
  overflow: hidden;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 650;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CheckCircle = styled.span<{ $selected: boolean }>`
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: 1px solid ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.gray300)};
  border-radius: 50%;
  background: ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.white)};
  color: ${theme.colors.white};
`;

export const EmptyResult = styled.div`
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 20px;
  color: ${theme.colors.gray500};
  font-size: 12px;
  font-weight: 650;
  text-align: center;

  strong {
    color: ${theme.colors.black};
    font-size: 14px;
    font-weight: 850;
  }

  span {
    line-height: 1.5;
  }
`;

export const SearchNotice = styled.div`
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  padding: 0 12px;
  border-radius: 14px;
  background: #fff7ed;
  color: #9a5b15;
  font-size: 10px;
  font-weight: 750;

  button {
    min-height: 30px;
    padding: 0 9px;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.white};
    color: inherit;
    font-weight: 850;
  }
`;

export const ManualEntryButton = styled.button<{ $selected: boolean }>`
  width: 100%;
  min-height: 66px;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 18px;
  align-items: center;
  gap: 11px;
  margin-top: 8px;
  padding: 10px 13px;
  border: 2px solid ${({ $selected }) => ($selected ? theme.colors.black : 'transparent')};
  border-radius: 18px;
  background: ${({ $selected }) => ($selected ? theme.colors.white : theme.colors.gray100)};
  color: ${theme.colors.black};
  text-align: left;

  > span {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;

    strong {
      overflow: hidden;
      font-size: 12px;
      font-weight: 850;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    small {
      color: ${theme.colors.gray500};
      font-size: 9px;
      font-weight: 650;
    }
  }

  > svg {
    transform: rotate(-90deg);
  }
`;

export const ManualIcon = styled.i`
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: ${theme.colors.white};
`;
