import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Wrapper = styled.div<{ $compact: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $compact }) => ($compact ? '9px' : '12px')};
`;

export const Heading = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
`;

export const Label = styled.strong`
  color: ${theme.colors.black};
  font-size: 13px;
  font-weight: 900;
  letter-spacing: -0.025em;
`;

export const Description = styled.span`
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 650;
`;

export const Count = styled.span`
  color: ${theme.colors.accent};
  font-size: 11px;
  font-weight: 850;
`;

export const OptionList = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 1px 0 4px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const OptionChip = styled.button<{ $active: boolean }>`
  flex: 0 0 auto;
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0 14px 0 7px;
  border: 1px solid ${({ $active }) => ($active ? theme.colors.black : theme.colors.gray200)};
  border-radius: ${theme.radius.full};
  background: ${({ $active }) => ($active ? theme.colors.black : theme.colors.white)};
  color: ${({ $active }) => ($active ? theme.colors.white : theme.colors.black)};
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;

  &:active {
    transform: scale(0.98);
  }
`;

export const Avatar = styled.span<{ $linked: boolean }>`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: ${({ $linked }) => ($linked ? '#DDF8E7' : theme.colors.gray100)};
  color: ${({ $linked }) => ($linked ? theme.colors.success : theme.colors.gray600)};
`;

export const Hint = styled.p`
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 650;
  line-height: 1.45;
`;
