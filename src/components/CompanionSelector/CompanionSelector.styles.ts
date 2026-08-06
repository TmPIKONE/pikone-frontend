import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

export const Heading = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
`;

export const Label = styled.span`
  color: ${theme.colors.black};
  font-size: 13px;
  font-weight: 900;
  letter-spacing: -0.025em;
`;

export const Description = styled.span`
  flex: 0 0 auto;
  color: ${theme.colors.gray400};
  font-size: 9px;
  font-weight: 700;
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
  min-height: 47px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  border-radius: ${theme.radius.full};
  background: ${({ $active }) => ($active ? theme.colors.black : theme.colors.gray100)};
  color: ${({ $active }) => ($active ? theme.colors.white : theme.colors.black)};
  font-size: 12px;
  font-weight: 850;
  white-space: nowrap;

  i {
    width: 12px;
    height: 12px;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.peach};
  }

  i.alone {
    background: ${theme.colors.gray400};
  }

  i.linked {
    background: #55d887;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const EmptyHint = styled.p`
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 650;
  line-height: 1.5;
`;

export const SelectionHint = styled(EmptyHint)`
  color: ${theme.colors.gray600};
`;
