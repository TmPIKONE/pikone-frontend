import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Nav = styled.nav<{ $activeIndex: number }>`
  position: fixed;
  bottom: calc(32px + env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  width: min(calc(100% - 84px), 318px);
  height: 60px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(246, 247, 249, 0.72)),
    rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: ${theme.radius.full};
  box-shadow:
    0 18px 42px rgba(15, 23, 42, 0.16),
    0 3px 10px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.98),
    inset 0 -1px 0 rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(28px) saturate(190%);
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
  padding: 5px;
  overflow: hidden;
    
  &::before {
    content: '';
    position: absolute;
    inset: 1px 10px auto;
    height: 48px;
    border-radius: inherit;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.82),
      rgba(255, 255, 255, 0)
    );
    pointer-events: none;
  }

    &::after {
        content: '';
        position: absolute;
        top: 5px;
        left: calc(5px + ((100% - 10px) / 4) * ${({ $activeIndex }) => $activeIndex});
        width: calc((100% - 10px) / 4);
        height: 48px;
        border-radius: ${theme.radius.full};

        background: #E4E4E5;

        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

        transition:
                left 0.42s cubic-bezier(0.22, 1, 0.36, 1),
                transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);

        pointer-events: none;
    }
`;

export const NavItem = styled.button<{ $active: boolean }>`
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  color: ${({ $active }) => ($active ? theme.colors.black : theme.colors.black)};
  opacity: ${({ $active }) => ($active ? 1 : 0.86)};
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;

  svg {
    width: 22px;
    height: 22px;
    filter: ${({ $active }) =>
      $active ? 'drop-shadow(0 1px 0 rgba(255, 255, 255, 0.35))' : 'none'};
    transition:
      fill 0.18s ease,
      stroke-width 0.18s ease,
      transform 0.18s ease;
  }

  span {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
