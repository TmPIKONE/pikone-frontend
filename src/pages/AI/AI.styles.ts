import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  min-height: 100dvh;
  padding: calc(env(safe-area-inset-top, 0px) + 22px) ${theme.app.pagePadding} 34px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: ${theme.colors.white};
`;

export const Header = styled.header`
  padding: 10px 2px 6px;
`;

export const Eyebrow = styled.span`
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.05em;
`;

export const Title = styled.h1`
  margin: 8px 0 0;
  color: ${theme.colors.black};
  font-size: clamp(30px, 8vw, 38px);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.055em;
`;

export const Subtitle = styled.p`
  margin: 10px 0 0;
  color: ${theme.colors.gray500};
  font-size: 14px;
  font-weight: 650;
  line-height: 1.6;
`;

export const ChatCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 17px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 24px;
  background: ${theme.colors.white};
`;

export const MascotRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

export const Mascot = styled.span`
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: ${theme.colors.black};
  color: ${theme.colors.white};
`;

export const BotBubble = styled.div`
  padding: 12px 14px;
  border-radius: 6px 17px 17px 17px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray700};
  font-size: 11px;
  font-weight: 650;
  line-height: 1.55;
`;

export const ChatComposer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 9px;
  padding: 10px 10px 10px 13px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 18px;
  background: ${theme.colors.white};

  &:focus-within {
    border-color: ${theme.colors.black};
  }
`;

export const ChatInput = styled.textarea`
  width: 100%;
  min-width: 0;
  min-height: 92px;
  padding: 13px 14px;
  resize: vertical;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 16px;
  outline: 0;
  background: ${theme.colors.white};
  color: ${theme.colors.gray900};
  font: inherit;
  font-size: 14px;
  font-weight: 650;
  line-height: 1.5;

  &:focus {
    border-color: ${theme.colors.black};
  }

  &::placeholder {
    color: ${theme.colors.gray400};
  }
`;

export const PromptStageInput = styled(ChatInput)`
  min-height: 230px;
  padding: 18px;
  resize: none;
  border-radius: 22px;
  background: ${theme.colors.gray50};
  font-size: 15px;
  line-height: 1.65;

  &:focus {
    background: ${theme.colors.white};
  }
`;

export const SendButton = styled.button`
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: ${theme.colors.black};
  color: ${theme.colors.white};

  &:disabled {
    opacity: 0.35;
  }
`;

export const Spinner = styled.span`
  width: 17px;
  height: 17px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: ${theme.colors.white};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const UnderstoodBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 2px;
`;

export const UnderstoodTitle = styled.strong`
  color: ${theme.colors.gray600};
  font-size: 10px;
  font-weight: 850;
`;

export const ContextChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

export const ContextChip = styled.span`
  min-height: 31px;
  display: inline-flex;
  align-items: center;
  padding: 0 11px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray700};
  font-size: 10px;
  font-weight: 800;
`;

export const GroupDecisionCard = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 15px 16px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 20px;
  background: ${theme.colors.white};
`;

export const GroupDecisionHeader = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 11px;
`;

export const GroupDecisionIcon = styled.span`
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.black};
`;

export const GroupDecisionText = styled.span`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: ${theme.colors.gray900};
    font-size: 12px;
    font-weight: 900;
  }

  span {
    color: ${theme.colors.gray500};
    font-size: 10px;
    font-weight: 650;
    line-height: 1.45;
  }
`;

export const ActiveRoomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 2px;
`;

export const ActiveRoomHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 2px;

  strong {
    color: ${theme.colors.gray700};
    font-size: 10px;
    font-weight: 900;
  }

  span {
    color: ${theme.colors.gray400};
    font-size: 9px;
    font-weight: 750;
  }
`;

export const ActiveRoomList = styled.div`
  overflow: hidden;
  border: 1px solid ${theme.colors.gray100};
  border-radius: 15px;
  background: ${theme.colors.gray50};
`;

export const ActiveRoomButton = styled.button`
  width: 100%;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  text-align: left;
  color: ${theme.colors.gray700};

  & + & {
    border-top: 1px solid ${theme.colors.gray100};
  }

  &:active {
    background: ${theme.colors.gray100};
  }
`;

export const ActiveRoomText = styled.span`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    overflow: hidden;
    color: ${theme.colors.gray900};
    font-size: 11px;
    font-weight: 900;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    overflow: hidden;
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ActiveRoomAside = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${theme.colors.gray400};

  em {
    padding: 4px 7px;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.black};
    color: ${theme.colors.white};
    font-size: 8px;
    font-style: normal;
    font-weight: 850;
  }
`;

export const GroupDecisionActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 360px) {
    grid-template-columns: 1fr;
  }
`;

const groupActionButton = `
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 12px;
  border-radius: 13px;
  font-size: 10px;
  font-weight: 850;
  line-height: 1.2;
`;

export const GroupPrimaryButton = styled.button`
  ${groupActionButton}
  border: 1px solid ${theme.colors.black};
  background: ${theme.colors.black};
  color: ${theme.colors.white};

  &:active {
    opacity: 0.82;
  }
`;

export const GroupSecondaryButton = styled.button<{ $active: boolean }>`
  ${groupActionButton}
  border: 1px solid ${({ $active }) => ($active ? theme.colors.gray700 : theme.colors.gray200)};
  background: ${({ $active }) => ($active ? theme.colors.gray100 : theme.colors.white)};
  color: ${theme.colors.gray700};

  &:active {
    background: ${theme.colors.gray100};
  }
`;

export const JoinCodeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding-top: 11px;
  border-top: 1px solid ${theme.colors.gray100};
`;

export const JoinCodeLabel = styled.label`
  color: ${theme.colors.gray700};
  font-size: 10px;
  font-weight: 850;
`;

export const JoinCodeRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;

  @media (max-width: 340px) {
    grid-template-columns: 1fr;
  }
`;

export const JoinCodeInputWrap = styled.div`
  min-width: 0;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 13px;
  background: ${theme.colors.gray50};
  color: ${theme.colors.gray500};

  &:focus-within {
    border-color: ${theme.colors.gray700};
    background: ${theme.colors.white};
  }

  input {
    min-width: 0;
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: ${theme.colors.gray900};
    font: inherit;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  input::placeholder {
    color: ${theme.colors.gray400};
    font-weight: 700;
    letter-spacing: 0;
  }
`;

export const JoinCodeSubmitButton = styled.button`
  min-height: 44px;
  padding: 0 14px;
  border-radius: 13px;
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 10px;
  font-weight: 900;
  white-space: nowrap;

  &:disabled {
    opacity: 0.38;
    cursor: default;
  }
`;

export const JoinCodeHint = styled.span`
  color: ${theme.colors.gray500};
  font-size: 9px;
  font-weight: 650;
`;

export const JoinCodeError = styled.span`
  color: #b42318;
  font-size: 10px;
  font-weight: 750;
`;

export const LocationCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 17px;
  border-radius: 22px;
  background: ${theme.colors.gray100};
`;

export const CompanionShortcut = styled.button`
  width: 100%;
  min-height: 62px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 11px;
  padding: 10px 13px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 18px;
  background: ${theme.colors.white};
  text-align: left;

  > span {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  small {
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 750;
  }

  strong {
    overflow: hidden;
    color: ${theme.colors.gray900};
    font-size: 12px;
    font-weight: 900;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  b {
    color: ${theme.colors.gray600};
    font-size: 10px;
    font-weight: 850;
  }
`;

export const CompanionShortcutIcon = styled.span`
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray700};
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: ${theme.colors.gray700};
`;

export const SectionEyebrow = styled.span`
  display: block;
  color: ${theme.colors.gray500};
  font-size: 9px;
  font-weight: 800;
`;

export const SectionTitle = styled.strong`
  display: block;
  margin-top: 4px;
  color: ${theme.colors.gray900};
  font-size: 14px;
  font-weight: 900;
`;

export const LocationOptions = styled.div`
  display: flex;
  gap: 7px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const LocationChip = styled.button<{ $selected: boolean }>`
  min-height: 44px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 13px;
  border: 1px solid ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.gray200)};
  border-radius: ${theme.radius.full};
  background: ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.white)};
  color: ${({ $selected }) => ($selected ? theme.colors.white : theme.colors.gray700)};
  font-size: 10px;
  font-weight: 800;

  &:disabled {
    opacity: 0.4;
  }
`;

export const Warning = styled.div`
  padding: 10px 12px;
  border-radius: 12px;
  background: #fff6dc;
  color: #7d5a0a;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.45;
`;

export const DestinationArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SearchBox = styled.div`
  min-height: 46px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 14px;
  background: ${theme.colors.white};
  color: ${theme.colors.gray500};

  input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    background: transparent;
    color: ${theme.colors.gray900};
    font: inherit;
    font-size: 12px;
    font-weight: 700;
  }

  button {
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.gray100};
    color: ${theme.colors.gray500};
  }
`;

export const SearchStatus = styled.p`
  margin: 2px;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 650;
`;

export const SearchResults = styled.div`
  overflow: hidden;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 14px;
  background: ${theme.colors.white};

  > button {
    width: 100%;
    min-height: 56px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    color: ${theme.colors.gray600};
    text-align: left;
  }

  > button + button {
    border-top: 1px solid ${theme.colors.gray100};
  }

  span {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  strong {
    color: ${theme.colors.gray900};
    font-size: 11px;
    font-weight: 850;
  }

  small {
    overflow: hidden;
    color: ${theme.colors.gray500};
    font-size: 9px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const SelectedDestination = styled.div`
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid ${theme.colors.black};
  border-radius: 14px;
  background: ${theme.colors.white};

  div {
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
    overflow: hidden;
    color: ${theme.colors.gray500};
    font-size: 9px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  button {
    min-height: 32px;
    padding: 0 10px;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.gray100};
    color: ${theme.colors.gray700};
    font-size: 10px;
    font-weight: 800;
  }
`;

export const RecentRow = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  button {
    min-height: 32px;
    flex-shrink: 0;
    padding: 0 11px;
    border: 1px solid ${theme.colors.gray200};
    border-radius: ${theme.radius.full};
    background: ${theme.colors.white};
    color: ${theme.colors.gray700};
    font-size: 9px;
    font-weight: 750;
  }
`;

export const ManualToggle = styled.button`
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 16px;
  background: ${theme.colors.white};
  color: ${theme.colors.gray700};
  font-size: 11px;
  font-weight: 800;
`;

export const ManualBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  background: rgba(17, 17, 17, 0.34);
  backdrop-filter: blur(2px);
`;

export const ManualPanel = styled.section`
  width: min(100%, 480px);
  max-height: min(82dvh, 760px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 12px 18px calc(env(safe-area-inset-bottom, 0px) + 18px);
  border-radius: 28px 28px 0 0;
  background: ${theme.colors.white};
  box-shadow: 0 -16px 48px rgba(17, 17, 17, 0.16);
`;

export const ManualSheetHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: -12px -4px 0;
  padding: 18px 4px 12px;
  background: ${theme.colors.white};

  &::before {
    content: '';
    position: absolute;
    top: 7px;
    left: 50%;
    width: 38px;
    height: 4px;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.gray200};
    transform: translateX(-50%);
  }

  > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  strong {
    color: ${theme.colors.gray900};
    font-size: 17px;
    font-weight: 900;
  }

  span {
    color: ${theme.colors.gray500};
    font-size: 10px;
    font-weight: 650;
  }

  button {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.gray100};
    color: ${theme.colors.gray700};
  }
`;

export const ManualFeedback = styled.p`
  margin: -8px 0 -2px;
  padding: 10px 12px;
  border-radius: 13px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray700};
  font-size: 10px;
  font-weight: 700;
  line-height: 1.5;
`;

export const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

export const OptionLabel = styled.strong`
  color: ${theme.colors.gray700};
  font-size: 11px;
  font-weight: 850;

  small {
    margin-left: 4px;
    color: ${theme.colors.gray400};
    font-size: 9px;
    font-weight: 700;
  }
`;

export const OptionHelp = styled.p`
  margin: -3px 0 0;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 650;
  line-height: 1.5;
`;

export const GroupDecisionLink = styled.button`
  min-height: 42px;
  align-self: flex-start;
  padding: 0 12px;
  border-radius: 12px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray700};
  font-size: 10px;
  font-weight: 850;
`;

export const OptionChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

export const OptionChip = styled.button<{ $selected: boolean }>`
  min-height: 44px;
  padding: 0 13px;
  border: 1px solid ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.gray200)};
  border-radius: ${theme.radius.full};
  background: ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.white)};
  color: ${({ $selected }) => ($selected ? theme.colors.white : theme.colors.gray700)};
  font-size: 10px;
  font-weight: 750;
`;

export const ConstraintChoice = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
  margin-top: 2px;
  padding: 4px;
  border-radius: 15px;
  background: ${theme.colors.gray100};

  button {
    min-height: 42px;
    padding: 0 9px;
    border-radius: 12px;
    background: transparent;
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 800;
    line-height: 1.3;
  }

  button[data-selected='true'] {
    background: ${theme.colors.white};
    color: ${theme.colors.gray900};
    box-shadow: 0 1px 4px rgba(17, 17, 17, 0.08);
  }
`;

export const ManualApplyButton = styled.button`
  position: sticky;
  bottom: 0;
  min-height: 52px;
  margin-top: 2px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: 900;
  box-shadow: 0 -8px 18px rgba(255, 255, 255, 0.88);
`;

export const FooterCard = styled.section<{ $exhausted: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background: ${({ $exhausted }) => ($exhausted ? theme.colors.gray900 : theme.colors.gray100)};
  color: ${({ $exhausted }) => ($exhausted ? theme.colors.white : theme.colors.gray900)};

  div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  strong {
    font-size: 11px;
    font-weight: 850;
  }
  span {
    color: ${({ $exhausted }) => ($exhausted ? 'rgba(255,255,255,.58)' : theme.colors.gray500)};
    font-size: 9px;
    font-weight: 650;
  }

  b {
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 900;
  }
`;

export const ErrorText = styled.p`
  margin: 0;
  color: ${theme.colors.error};
  font-size: 10px;
  font-weight: 700;
`;

export const SubmitButton = styled.button`
  min-height: 56px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 13px;
  font-weight: 900;

  &:disabled {
    background: ${theme.colors.gray200};
    color: ${theme.colors.gray500};
  }
`;

export const ResumeCard = styled.section`
  display: grid;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 16px;
  background: #fff;
`;

export const ResumeTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  strong {
    font-size: 15px;
  }
  span {
    display: block;
    margin-top: 3px;
    color: #6b7280;
    font-size: 12px;
    line-height: 1.45;
  }
`;

export const ResumeActions = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  button {
    min-height: 42px;
    border-radius: 12px;
    border: 1px solid #d1d5db;
    padding: 0 14px;
    font-weight: 700;
    background: #fff;
  }
  button:first-of-type {
    background: #171717;
    color: #fff;
    border-color: #171717;
  }
`;

export const RecentHistory = styled.section`
  display: grid;
  gap: 9px;
`;
export const RecentHistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  strong {
    font-size: 15px;
  }
  span {
    color: #6b7280;
    font-size: 12px;
  }
`;
export const HistoryButton = styled.button`
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
  padding: 11px 13px;
  strong {
    display: block;
    font-size: 14px;
  }
  span {
    display: block;
    margin-top: 3px;
    color: #6b7280;
    font-size: 12px;
  }
`;

export const CompactHistoryNote = styled.p`
  margin: -2px 2px 4px;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 650;
  line-height: 1.45;
`;

export const LocationSummary = styled.div`
  min-width: 0;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  > div {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${theme.colors.gray700};
  }

  strong {
    min-width: 0;
    overflow: hidden;
    color: ${theme.colors.gray900};
    font-size: 15px;
    font-weight: 900;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ChangeLocationButton = styled.button`
  min-height: 40px;
  flex-shrink: 0;
  padding: 0 9px;
  border-radius: ${theme.radius.full};
  color: ${theme.colors.gray700};
  font-size: 12px;
  font-weight: 850;
`;

export const PromptLabel = styled.label`
  color: ${theme.colors.gray900};
  font-size: 14px;
  font-weight: 900;

  small {
    margin-left: 4px;
    color: ${theme.colors.gray400};
    font-size: 10px;
    font-weight: 700;
  }
`;

export const QuickConditionSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 2px;
`;

export const QuickConditionLabel = styled.span`
  color: ${theme.colors.gray500};
  font-size: 9px;
  font-weight: 800;
`;

export const CriteriaCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 15px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 18px;
  background: ${theme.colors.gray50};
`;

export const CriteriaTop = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  > span {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  small {
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 800;
  }

  strong {
    overflow: hidden;
    color: ${theme.colors.gray900};
    font-size: 11px;
    font-weight: 850;
    line-height: 1.4;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  button {
    min-height: 38px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 0 10px;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.white};
    color: ${theme.colors.gray700};
    font-size: 10px;
    font-weight: 850;
    box-shadow: inset 0 0 0 1px ${theme.colors.gray200};
  }
`;

export const CriteriaChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  span {
    min-height: 28px;
    display: inline-flex;
    align-items: center;
    padding: 0 9px;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.white};
    color: ${theme.colors.gray600};
    font-size: 9px;
    font-weight: 750;
  }
`;

export const QuickConditions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

export const InterpretationRow = styled.div`
  min-width: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding-top: 2px;

  > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    color: ${theme.colors.gray700};
    font-size: 12px;
    font-weight: 850;
    line-height: 1.45;
  }

  span {
    overflow-wrap: anywhere;
    color: ${theme.colors.gray500};
    font-size: 11px;
    font-weight: 700;
    line-height: 1.45;
  }

  button {
    min-height: 36px;
    flex-shrink: 0;
    padding: 0 8px;
    color: ${theme.colors.gray700};
    font-size: 12px;
    font-weight: 850;
  }
`;

export const UsageInline = styled.p`
  margin: -5px 0 0;
  color: ${theme.colors.gray500};
  font-size: 11px;
  font-weight: 700;
  text-align: center;
`;

export const RecentLocationLabel = styled.span`
  margin: 2px 2px -1px;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 750;
`;

export const PinLocationCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 16px;
  background: ${theme.colors.white};

  > div {
    min-width: 0;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    overflow-wrap: anywhere;
    color: ${theme.colors.gray900};
    font-size: 12px;
    font-weight: 900;
    line-height: 1.35;
  }

  span {
    overflow-wrap: anywhere;
    color: ${theme.colors.gray500};
    font-size: 10px;
    font-weight: 650;
    line-height: 1.45;
  }

  button {
    min-height: 44px;
    flex-shrink: 0;
    padding: 0 13px;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.black};
    color: ${theme.colors.white};
    font-size: 10px;
    font-weight: 850;
  }

  button:disabled {
    background: ${theme.colors.gray200};
    color: ${theme.colors.gray500};
  }

  @media (max-width: 360px) {
    align-items: stretch;
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`;

export const CardFlowHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  padding: 0 4px;
`;

export const CardProgressMeta = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;

  span {
    color: ${theme.colors.gray400};
    font-size: 9px;
    font-weight: 850;
    letter-spacing: 0.08em;
  }

  strong {
    overflow: hidden;
    color: ${theme.colors.gray900};
    font-size: 12px;
    font-weight: 900;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const CardDots = styled.div`
  display: flex;
  gap: 5px;
  padding-bottom: 2px;

  span {
    width: 6px;
    height: 6px;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.gray200};
    transition:
      width 180ms ease,
      background 180ms ease;
  }

  span[data-done='true'] {
    background: ${theme.colors.gray500};
  }

  span[data-active='true'] {
    width: 20px;
    background: ${theme.colors.black};
  }
`;

export const CardDeck = styled.div`
  position: relative;
  isolation: isolate;
  margin: 3px 4px 10px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    left: 12px;
    right: 12px;
    height: 100%;
    border: 1px solid ${theme.colors.gray100};
    border-radius: 28px;
    background: ${theme.colors.gray50};
  }

  &::before {
    top: 8px;
    transform: scale(0.985);
  }

  &::after {
    top: 15px;
    left: 22px;
    right: 22px;
    opacity: 0.62;
    transform: scale(0.965);
  }
`;

export const FlowCard = styled.section<{ $direction: 'forward' | 'backward' }>`
  min-height: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 22px 19px 18px;
  overflow: hidden;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 28px;
  background: ${theme.colors.white};
  box-shadow: 0 14px 42px rgba(17, 17, 17, 0.07);
  animation: ${({ $direction }) => ($direction === 'forward' ? 'flow-card-in-right' : 'flow-card-in-left')}
    220ms ease both;

  @keyframes flow-card-in-right {
    from {
      opacity: 0;
      transform: translateX(18px) scale(0.99);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes flow-card-in-left {
    from {
      opacity: 0;
      transform: translateX(-18px) scale(0.99);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const FlowCardHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FlowEyebrow = styled.span`
  color: ${theme.colors.gray400};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.1em;
`;

export const FlowTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.gray900};
  font-size: 24px;
  font-weight: 900;
  line-height: 1.22;
  letter-spacing: -0.035em;
`;

export const FlowDescription = styled.p`
  margin: 0;
  color: ${theme.colors.gray500};
  font-size: 11px;
  font-weight: 650;
  line-height: 1.55;
`;

export const CompanionCardGrid = styled.div`
  display: grid;
  gap: 9px;
`;

export const CompanionChoice = styled.button<{ $selected: boolean }>`
  width: 100%;
  min-height: 72px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  padding: 11px 13px;
  border: 1px solid ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.gray200)};
  border-radius: 19px;
  background: ${({ $selected }) => ($selected ? theme.colors.gray50 : theme.colors.white)};
  text-align: left;

  > span:last-child {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    color: ${theme.colors.gray900};
    font-size: 13px;
    font-weight: 900;
  }

  small {
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 650;
  }
`;

export const CompanionAvatar = styled.span`
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 13px;
  font-weight: 900;
`;

export const FlowHint = styled.p`
  margin: 0;
  padding: 11px 12px;
  border-radius: 14px;
  background: ${theme.colors.gray50};
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 650;
  line-height: 1.5;

  button {
    margin-left: 4px;
    color: ${theme.colors.gray900};
    font-size: inherit;
    font-weight: 850;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

export const CriteriaSummaryList = styled.div`
  overflow: hidden;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 19px;
  background: ${theme.colors.white};
`;

export const CriteriaSummaryRow = styled.div<{ $multiline?: boolean }>`
  min-height: 58px;
  display: grid;
  grid-template-columns: 68px minmax(0, 1fr);
  align-items: ${({ $multiline }) => ($multiline ? 'start' : 'center')};
  gap: 12px;
  padding: 12px 14px;

  & + & {
    border-top: 1px solid ${theme.colors.gray100};
  }

  span {
    padding-top: ${({ $multiline }) => ($multiline ? '2px' : '0')};
    color: ${theme.colors.gray400};
    font-size: 9px;
    font-weight: 850;
  }

  strong {
    min-width: 0;
    color: ${theme.colors.gray900};
    font-size: 11px;
    font-weight: 850;
    line-height: 1.5;
    text-align: right;
    word-break: keep-all;
  }
`;

export const DetailEditButton = styled.button`
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 15px;
  background: ${theme.colors.gray50};
  color: ${theme.colors.gray700};
  font-size: 11px;
  font-weight: 850;
`;

export const FinalCriteriaPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 16px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 22px;
  background: ${theme.colors.gray50};
`;

export const CardNavigation = styled.div`
  display: grid;
  grid-template-columns: minmax(0, auto) minmax(0, 1fr);
  align-items: center;
  gap: 9px;
  margin-top: auto;
  padding-top: 4px;
`;

export const CardBackButton = styled.button`
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 14px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.full};
  background: ${theme.colors.white};
  color: ${theme.colors.gray600};
  font-size: 11px;
  font-weight: 850;
`;

export const CardNextButton = styled.button`
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: 900;

  &:disabled {
    background: ${theme.colors.gray200};
    color: ${theme.colors.gray500};
  }
`;

export const CardSubmitButton = styled(CardNextButton)`
  width: 100%;
`;

export const PromptSuggestionArea = styled.section`
  display: grid;
  gap: 10px;
  margin-top: 14px;
`;

export const PromptSuggestionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  div {
    min-width: 0;
    display: grid;
    gap: 3px;
  }

  strong {
    font-size: 14px;
    font-weight: 900;
    letter-spacing: -0.025em;
  }

  span {
    color: ${theme.colors.gray600};
    font-size: 11px;
    font-weight: 650;
    line-height: 1.4;
  }

  button {
    flex: 0 0 auto;
    padding: 6px 2px;
    color: ${theme.colors.gray600};
    font-size: 11px;
    font-weight: 850;
  }

  button:disabled {
    opacity: 0.45;
  }
`;

export const PromptSuggestionList = styled.div`
  display: grid;
  gap: 8px;
`;

export const PromptSuggestionButton = styled.button`
  width: 100%;
  padding: 12px 13px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 14px;
  background: white;
  text-align: left;
  font-size: 13px;
  font-weight: 760;
  line-height: 1.5;
  letter-spacing: -0.018em;
  transition:
    border-color 120ms ease,
    transform 120ms ease,
    background 120ms ease;

  &[data-selected='true'] {
    border-color: #111;
    background: ${theme.colors.gray50};
  }

  &:active {
    transform: scale(0.992);
  }
`;

export const PromptSuggestionMeta = styled.p`
  margin: 0;
  color: ${theme.colors.gray600};
  font-size: 10.5px;
  font-weight: 650;
  line-height: 1.45;
`;

export const PromptSuggestionStatus = styled.p`
  margin: 0;
  padding: 11px 12px;
  border-radius: 12px;
  background: ${theme.colors.gray50};
  color: ${theme.colors.gray600};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.45;
`;
