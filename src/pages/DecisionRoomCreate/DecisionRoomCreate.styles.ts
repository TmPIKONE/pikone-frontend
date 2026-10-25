import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Page = styled.main`
  width: min(100%, ${theme.app.maxWidth});
  min-height: 100vh;
  margin: 0 auto;
  padding: 0 20px calc(116px + env(safe-area-inset-bottom, 0px));
  background: ${theme.colors.gray50};
`;

export const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  height: 58px;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  margin: 0 -20px;
  padding: env(safe-area-inset-top, 0px) 12px 0;
  background: color-mix(in srgb, ${theme.colors.gray50} 94%, transparent);
  backdrop-filter: blur(16px);
`;

export const IconButton = styled.button`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: ${theme.radius.full};
  background: transparent;
  color: ${theme.colors.gray900};

  &:active {
    background: ${theme.colors.gray100};
  }
`;

export const TopBarTitle = styled.strong`
  text-align: center;
  color: ${theme.colors.gray900};
  font-size: 15px;
  font-weight: 900;
  letter-spacing: -0.02em;
`;

export const TopBarSpacer = styled.span`
  width: 44px;
  height: 44px;
`;

export const Intro = styled.section`
  padding: 18px 2px 22px;
`;

export const Title = styled.h1`
  margin: 0;
  color: ${theme.colors.gray900};
  font-size: 26px;
  font-weight: 950;
  line-height: 1.25;
  letter-spacing: -0.045em;
`;

export const Description = styled.p`
  margin: 9px 0 0;
  color: ${theme.colors.gray600};
  font-size: 13px;
  font-weight: 650;
  line-height: 1.55;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 14px;
  padding: 19px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.xl};
  background: ${theme.colors.white};
`;

export const SectionHeading = styled.div`
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  align-items: start;
  gap: 11px;

  > div:last-child {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    color: ${theme.colors.gray900};
    font-size: 15px;
    font-weight: 900;
    letter-spacing: -0.02em;
  }

  span {
    color: ${theme.colors.gray500};
    font-size: 11px;
    font-weight: 650;
    line-height: 1.45;
  }
`;

export const SectionIcon = styled.span`
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray900};
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  color: ${theme.colors.gray700};
  font-size: 12px;
  font-weight: 850;
`;

export const OptionalText = styled.span`
  margin-left: 5px;
  color: ${theme.colors.gray400};
  font-size: 10px;
  font-weight: 750;
`;

export const Input = styled.input`
  width: 100%;
  min-height: 48px;
  padding: 0 13px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 14px;
  outline: none;
  background: ${theme.colors.gray50};
  color: ${theme.colors.gray900};
  font: inherit;
  font-size: 13px;
  font-weight: 650;
  transition:
    border-color ${theme.motion.fast} ${theme.motion.easing},
    background ${theme.motion.fast} ${theme.motion.easing};

  &::placeholder {
    color: ${theme.colors.gray400};
  }

  &:focus {
    border-color: ${theme.colors.gray700};
    background: ${theme.colors.white};
  }
`;

export const SegmentedControl = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  border-radius: 15px;
  background: ${theme.colors.gray100};
`;

export const SegmentButton = styled.button<{ $selected: boolean }>`
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 10px;
  border: 0;
  border-radius: 11px;
  background: ${({ $selected }) => ($selected ? theme.colors.white : 'transparent')};
  color: ${({ $selected }) => ($selected ? theme.colors.gray900 : theme.colors.gray500)};
  box-shadow: ${({ $selected }) => ($selected ? '0 1px 2px rgba(17, 19, 24, 0.06)' : 'none')};
  font-size: 11px;
  font-weight: 850;
`;

export const LocationState = styled.div<{ $ready: boolean }>`
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding: 12px 13px;
  border: 1px solid ${({ $ready }) => ($ready ? theme.colors.gray200 : theme.colors.gray200)};
  border-radius: 14px;
  background: ${({ $ready }) => ($ready ? theme.colors.gray50 : theme.colors.white)};
  color: ${({ $ready }) => ($ready ? theme.colors.gray700 : theme.colors.gray500)};

  > svg {
    justify-self: center;
  }

  > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  strong {
    color: ${theme.colors.gray900};
    font-size: 12px;
    font-weight: 850;
  }

  span {
    color: ${theme.colors.gray500};
    font-size: 10px;
    font-weight: 650;
    line-height: 1.4;
  }
`;

export const SearchArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SearchResults = styled.div`
  overflow: hidden;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 14px;
  background: ${theme.colors.white};
`;

export const SearchResult = styled.button`
  width: 100%;
  min-height: 55px;
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 0;
  background: transparent;
  color: ${theme.colors.gray500};
  text-align: left;

  & + & {
    border-top: 1px solid ${theme.colors.gray100};
  }

  > span {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  strong,
  small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: ${theme.colors.gray900};
    font-size: 12px;
    font-weight: 850;
  }

  small {
    color: ${theme.colors.gray500};
    font-size: 10px;
    font-weight: 650;
  }
`;

export const DistanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
`;

export const DistanceButton = styled.button<{ $selected: boolean }>`
  min-width: 0;
  min-height: 62px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 8px 6px;
  border: 1px solid ${({ $selected }) => ($selected ? theme.colors.gray900 : theme.colors.gray200)};
  border-radius: 14px;
  background: ${({ $selected }) => ($selected ? theme.colors.gray900 : theme.colors.white)};
  color: ${({ $selected }) => ($selected ? theme.colors.white : theme.colors.gray900)};

  strong {
    font-size: 11px;
    font-weight: 900;
  }

  span {
    color: ${({ $selected }) => ($selected ? 'rgba(255,255,255,0.7)' : theme.colors.gray500)};
    font-size: 9px;
    font-weight: 700;
  }
`;

export const OptionalSection = styled.section`
  overflow: hidden;
  margin-bottom: 14px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.xl};
  background: ${theme.colors.white};
`;

export const OptionalToggle = styled.button`
  width: 100%;
  min-height: 74px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 17px;
  border: 0;
  background: ${theme.colors.white};
  color: ${theme.colors.gray500};
  text-align: left;

  > span:first-of-type {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 11px;
  }

  > span:first-of-type > span:last-child {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  strong {
    color: ${theme.colors.gray900};
    font-size: 13px;
    font-weight: 900;
  }

  small {
    color: ${theme.colors.gray500};
    font-size: 10px;
    font-weight: 650;
  }
`;

export const OptionalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 4px 17px 18px;
  border-top: 1px solid ${theme.colors.gray100};
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

export const Chip = styled.button<{ $selected: boolean }>`
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid ${({ $selected }) => ($selected ? theme.colors.gray900 : theme.colors.gray200)};
  border-radius: ${theme.radius.full};
  background: ${({ $selected }) => ($selected ? theme.colors.gray900 : theme.colors.white)};
  color: ${({ $selected }) => ($selected ? theme.colors.white : theme.colors.gray700)};
  font-size: 10px;
  font-weight: 850;
`;

export const ErrorText = styled.p`
  margin: 2px 2px 12px;
  color: ${theme.colors.error};
  font-size: 11px;
  font-weight: 750;
`;

export const BottomBar = styled.div`
  position: fixed;
  z-index: 120;
  left: 50%;
  bottom: 0;
  width: min(100%, ${theme.app.maxWidth});
  transform: translateX(-50%);
  padding: 12px 20px calc(12px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid ${theme.colors.gray100};
  background: color-mix(in srgb, ${theme.colors.white} 97%, transparent);
  box-shadow: 0 -8px 24px rgba(17, 19, 24, 0.07);
  backdrop-filter: blur(18px);
`;

export const SubmitButton = styled.button`
  width: 100%;
  min-height: 54px;
  border: 0;
  border-radius: 17px;
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 14px;
  font-weight: 900;
  letter-spacing: -0.01em;

  &:disabled {
    opacity: 0.52;
    cursor: not-allowed;
  }
`;

export const DateTimeButton = styled.button<{ $selected: boolean }>`
  width: 100%;
  min-height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid ${({ $selected }) => ($selected ? theme.colors.gray700 : theme.colors.gray200)};
  border-radius: 14px;
  background: ${({ $selected }) => ($selected ? theme.colors.white : theme.colors.gray50)};
  color: ${theme.colors.gray500};
  text-align: left;

  > span:first-of-type {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  > span:first-of-type > svg {
    flex: 0 0 auto;
    color: ${({ $selected }) => ($selected ? theme.colors.gray900 : theme.colors.gray500)};
  }

  > span:first-of-type > span {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  strong,
  small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: ${({ $selected }) => ($selected ? theme.colors.gray900 : theme.colors.gray600)};
    font-size: 12px;
    font-weight: 850;
  }

  small {
    color: ${theme.colors.gray400};
    font-size: 9px;
    font-weight: 700;
  }

  > svg {
    flex: 0 0 auto;
  }
`;
