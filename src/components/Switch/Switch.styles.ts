import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const SwitchButton = styled.button<{ $on: boolean }>`
  width: 44px;
  height: 26px;
  border-radius: ${theme.radius.full};
  border: none;
  background-color: ${({ $on }) => ($on ? theme.colors.primary : theme.colors.gray300)};
  position: relative;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $on }) => ($on ? '21px' : '3px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${theme.colors.white};
    transition: left 0.15s ease;
  }
`;
