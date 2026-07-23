import styled from '@emotion/styled';

export const Shell = styled.nav`
  position: sticky;
  top: 0;
  z-index: 40;
  padding:
    calc(env(safe-area-inset-top, 0px) + 8px)
    16px
    4px;
  border-bottom: 1px solid rgba(216, 226, 241, 0.78);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 12px 28px rgba(36, 74, 124, 0.06);
  outline: none;
  touch-action: pan-y;
`;

export const HeaderRow = styled.div`
  max-width: 460px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  padding: 12px 12px 0px 0px;
`;

export const DatePickerButton = styled.button`
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 3px;
  border: 0;
  background: transparent;
  color: #182235;
  text-align: left;
  cursor: pointer;

  > svg {
    flex: 0 0 auto;
    color: #74849a;
    transition: transform 0.18s ease;
  }

  &[aria-expanded='true'] > svg {
    transform: rotate(180deg);
  }

  &:active {
    opacity: 0.72;
  }
`;

export const HeaderDateCopy = styled.span`
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 7px;
`;

export const HeaderYear = styled.span`
  color: #8190a4;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: -0.025em;
`;

export const HeaderMonthDay = styled.strong`
  overflow: hidden;
  color: #111827;
  font-size: 18px;
  font-weight: 830;
  letter-spacing: -0.045em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const NotificationButton = styled.button`
    position: relative;
    width: 42px;
    height: 42px;
    flex: 0 0 32px;
    display: grid;
    place-items: center;
    padding: 0;
    color: #96a0b3;
    cursor: pointer;

    &:active {
        transform: scale(0.96);
    }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -6px;
  width: 17px;
  height: 17px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #ef4444;
  color: #ffffff;
  font-size: 8px;
  font-weight: 900;
  line-height: 1;
`;

export const Rail = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  max-width: 460px;
  margin: 0 auto;
`;

export const SideDate = styled.button<{ $side: 'previous' | 'next' }>`
  min-width: 0;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: ${({ $side }) => ($side === 'previous' ? 'flex-start' : 'flex-end')};
  gap: 7px;
  padding: 0 2px;
  border: 0;
  background: transparent;
  color: #9dacbf;
  opacity: 0.42;
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;

  &:active {
    opacity: 0.72;
    transform: scale(0.97);
  }
`;

export const SideNumber = styled.span`
  overflow: hidden;
  font-size: clamp(17px, 5vw, 22px);
  font-weight: 820;
  line-height: 1;
  letter-spacing: -0.055em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SideWeekday = styled.span`
  flex: 0 0 auto;
  font-size: 11px;
  font-weight: 780;
`;

export const Selected = styled.div`
  min-width: 142px;
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 10px;
`;

export const SelectedNumber = styled.strong`
  color: #111827;
  font-size: clamp(27px, 7.2vw, 33px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.065em;
`;

export const SelectedBadge = styled.span<{ $isToday: boolean }>`
  min-width: 40px;
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 1px;
  border-radius: 999px;
  background: #111111;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  box-shadow: none;
`;
