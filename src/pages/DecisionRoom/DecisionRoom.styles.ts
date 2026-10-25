import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Page = styled.main`
  width: min(100%, ${theme.app.maxWidth});
  min-height: 100vh;
  margin: 0 auto;
  padding: 0 18px 132px;
  background: ${theme.colors.gray50};
`;

export const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  height: 58px;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  align-items: center;
  margin: 0 -18px;
  padding: env(safe-area-inset-top, 0px) 10px 0;
  background: color-mix(in srgb, ${theme.colors.gray50} 94%, transparent);
  backdrop-filter: blur(18px);
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
  min-width: 0;
  padding-left: 4px;
  text-align: center;
  color: ${theme.colors.gray900};
  font-size: 15px;
  font-weight: 900;
  letter-spacing: -0.02em;
`;

export const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
`;

export const MenuWrap = styled.div`
  position: relative;
`;

export const RoomMenu = styled.div`
  position: absolute;
  top: 44px;
  right: 0;
  z-index: 60;
  width: 148px;
  padding: 6px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 14px;
  background: ${theme.colors.white};
  box-shadow: 0 12px 32px rgba(17, 19, 24, 0.14);
`;

export const DeleteMenuButton = styled.button`
  width: 100%;
  min-height: 42px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 11px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: ${theme.colors.error};
  font-size: 11px;
  font-weight: 850;
  text-align: left;

  &:active {
    background: #fff2f2;
  }
`;

export const Hero = styled.section`
  padding: 22px 2px 18px;
`;

export const StatusPill = styled.span<{ $finalized: boolean }>`
  display: inline-flex;
  min-height: 25px;
  align-items: center;
  padding: 0 9px;
  border-radius: ${theme.radius.full};
  background: ${({ $finalized }) => ($finalized ? '#EAF7F0' : theme.colors.gray100)};
  color: ${({ $finalized }) => ($finalized ? theme.colors.success : theme.colors.gray600)};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: -0.01em;
`;

export const Title = styled.h1`
  margin: 9px 0 0;
  color: ${theme.colors.gray900};
  font-size: 27px;
  font-weight: 950;
  line-height: 1.23;
  letter-spacing: -0.045em;
`;

export const HeroMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 13px;
  margin-top: 10px;
  color: ${theme.colors.gray500};

  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
  }
`;

export const MeetingCard = styled.section`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 15px 16px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.white};
`;

export const MeetingIcon = styled.span`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray900};
`;

export const MeetingText = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;

  > span {
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 850;
  }

  > strong {
    overflow: hidden;
    color: ${theme.colors.gray900};
    font-size: 14px;
    font-weight: 900;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  > small {
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 650;
  }
`;

export const ProgressCard = styled.section`
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 15px 16px;
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.black};
  color: ${theme.colors.white};

  > div:last-child {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    font-size: 13px;
    font-weight: 900;
  }

  span {
    color: rgba(255, 255, 255, 0.72);
    font-size: 10px;
    font-weight: 650;
    line-height: 1.45;
  }
`;

export const ProgressIcon = styled.span`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.12);
`;

export const InviteCard = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
  padding: 15px 16px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.white};

  > div:first-of-type {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  > div:first-of-type > span {
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 850;
  }

  > div:first-of-type > strong {
    color: ${theme.colors.gray900};
    font-size: 13px;
    font-weight: 900;
  }

  > div:first-of-type > small {
    color: ${theme.colors.gray400};
    font-size: 9px;
    font-weight: 750;
    letter-spacing: 0.03em;
  }

  @media (max-width: 370px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const InviteActions = styled.div`
  flex: 0 0 auto;
  display: flex;
  gap: 6px;
`;

export const CompactButton = styled.button`
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 10px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 12px;
  background: ${theme.colors.white};
  color: ${theme.colors.gray700};
  font-size: 9px;
  font-weight: 850;
`;

export const PrimaryCompactButton = styled(CompactButton)`
  border-color: ${theme.colors.black};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
`;

export const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 12px;
  padding: 17px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.xl};
  background: ${theme.colors.white};
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.gray900};
  font-size: 16px;
  font-weight: 900;
  letter-spacing: -0.025em;
`;

export const SectionDescription = styled.p`
  margin: 5px 0 0;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 650;
  line-height: 1.45;
`;

export const Count = styled.span`
  flex: 0 0 auto;
  min-height: 27px;
  display: inline-flex;
  align-items: center;
  padding: 0 9px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
  font-size: 9px;
  font-weight: 850;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const Label = styled.label`
  color: ${theme.colors.gray700};
  font-size: 11px;
  font-weight: 850;
`;

export const Input = styled.input`
  width: 100%;
  min-height: 47px;
  padding: 0 13px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 14px;
  outline: none;
  background: ${theme.colors.gray50};
  color: ${theme.colors.gray900};
  font: inherit;
  font-size: 12px;
  font-weight: 650;

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
  border-radius: 14px;
  background: ${theme.colors.gray100};
`;

export const SegmentButton = styled.button<{ $selected: boolean }>`
  min-height: 39px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 0;
  border-radius: 10px;
  background: ${({ $selected }) => ($selected ? theme.colors.white : 'transparent')};
  color: ${({ $selected }) => ($selected ? theme.colors.gray900 : theme.colors.gray500)};
  box-shadow: ${({ $selected }) => ($selected ? '0 1px 2px rgba(17, 19, 24, 0.06)' : 'none')};
  font-size: 10px;
  font-weight: 850;
`;

export const SelectedLocation = styled.div<{ $ready: boolean }>`
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  padding: 11px 12px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 13px;
  background: ${({ $ready }) => ($ready ? theme.colors.gray50 : theme.colors.white)};
  color: ${({ $ready }) => ($ready ? theme.colors.gray700 : theme.colors.gray500)};

  > svg {
    justify-self: center;
  }

  > span {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  strong {
    overflow: hidden;
    color: ${theme.colors.gray900};
    font-size: 11px;
    font-weight: 850;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    overflow: hidden;
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 650;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ResultList = styled.div`
  overflow: hidden;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 13px;
  background: ${theme.colors.white};
`;

export const ResultButton = styled.button`
  width: 100%;
  min-height: 52px;
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr);
  align-items: center;
  gap: 7px;
  padding: 9px 11px;
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
    gap: 2px;
  }

  strong,
  small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: ${theme.colors.gray900};
    font-size: 11px;
    font-weight: 850;
  }

  small {
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 650;
  }
`;

export const RangeRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
`;

export const RangeButton = styled.button<{ $selected: boolean }>`
  min-height: 39px;
  padding: 0 8px;
  border: 1px solid ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.gray200)};
  border-radius: 12px;
  background: ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.white)};
  color: ${({ $selected }) => ($selected ? theme.colors.white : theme.colors.gray600)};
  font-size: 10px;
  font-weight: 850;
`;

export const PreferenceToggle = styled.button`
  width: 100%;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 2px;
  border: 0;
  background: transparent;
  color: ${theme.colors.gray600};
  text-align: left;

  span {
    font-size: 11px;
    font-weight: 800;
  }

  small {
    color: ${theme.colors.gray400};
    font-size: 9px;
    font-weight: 750;
  }
`;

export const PreferenceFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 2px;
`;

export const ParticipantList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Participant = styled.div`
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 14px;
  align-items: center;
  gap: 10px;
  min-height: 64px;
  padding: 8px 0;

  & + & {
    border-top: 1px solid ${theme.colors.gray100};
  }
`;

export const Avatar = styled.span`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray900};
  font-size: 13px;
  font-weight: 900;
`;

export const ParticipantMain = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;

  strong {
    color: ${theme.colors.gray900};
    font-size: 12px;
    font-weight: 900;
  }

  > span {
    overflow: hidden;
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 650;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
`;

export const Tag = styled.span<{ $muted?: boolean }>`
  min-height: 20px;
  display: inline-flex;
  align-items: center;
  padding: 0 7px;
  border-radius: ${theme.radius.full};
  background: ${({ $muted }) => ($muted ? theme.colors.gray50 : theme.colors.gray100)};
  color: ${({ $muted }) => ($muted ? theme.colors.gray500 : theme.colors.gray700)};
  font-size: 8px;
  font-weight: 750;
`;

export const ReadyDot = styled.span<{ $ready: boolean }>`
  width: 8px;
  height: 8px;
  justify-self: center;
  border-radius: ${theme.radius.full};
  background: ${({ $ready }) => ($ready ? theme.colors.success : theme.colors.gray300)};
`;

export const PrimaryButton = styled.button`
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 14px;
  border: 0;
  border-radius: 14px;
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 11px;
  font-weight: 900;

  &:disabled {
    opacity: 0.35;
  }
`;

export const SecondaryButton = styled.button`
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 12px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 13px;
  background: ${theme.colors.white};
  color: ${theme.colors.gray700};
  font-size: 10px;
  font-weight: 850;

  &:disabled {
    opacity: 0.4;
  }
`;

export const FormActions = styled.div`
  display: grid;
  grid-template-columns: 0.7fr 1.3fr;
  gap: 7px;
`;

export const TextButton = styled.button`
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  align-self: center;
  padding: 0 10px;
  border: 0;
  background: transparent;
  color: ${theme.colors.gray500};
  font-size: 9px;
  font-weight: 800;

  &:disabled {
    opacity: 0.4;
  }
`;

export const HelperText = styled.p`
  margin: -7px 0 0;
  color: ${theme.colors.gray400};
  text-align: center;
  font-size: 9px;
  font-weight: 650;
`;

export const CandidateList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Candidate = styled.article`
  display: flex;
  flex-direction: column;
  gap: 11px;
  padding: 14px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.white};
`;

export const CandidateTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

export const CandidateText = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;

  strong {
    overflow: hidden;
    color: ${theme.colors.gray900};
    font-size: 15px;
    font-weight: 900;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    overflow: hidden;
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 650;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ConsensusBadge = styled.span<{ $positive: boolean; $warning: boolean }>`
  flex: 0 0 auto;
  min-height: 25px;
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  border-radius: ${theme.radius.full};
  background: ${({ $positive, $warning }) =>
    $positive ? '#EAF7F0' : $warning ? theme.colors.accentLight : theme.colors.gray100};
  color: ${({ $positive, $warning }) =>
    $positive ? theme.colors.success : $warning ? theme.colors.accent : theme.colors.gray600};
  font-size: 8px;
  font-weight: 900;
`;

export const Reason = styled.p`
  margin: 0;
  color: ${theme.colors.gray600};
  font-size: 10px;
  font-weight: 650;
  line-height: 1.5;
`;

export const SimpleMetrics = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;

  span {
    min-height: 23px;
    display: inline-flex;
    align-items: center;
    padding: 0 8px;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.gray50};
    color: ${theme.colors.gray500};
    font-size: 8px;
    font-weight: 750;
  }
`;

export const Conflict = styled.div`
  padding: 9px 10px;
  border-radius: 11px;
  background: ${theme.colors.accentLight};
  color: ${theme.colors.accent};
  font-size: 9px;
  font-weight: 750;
  line-height: 1.45;
`;

export const VoteRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
`;

export const VoteButton = styled.button<{ $selected: boolean }>`
  min-width: 0;
  min-height: 43px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 5px;
  border: 1px solid ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.gray200)};
  border-radius: 12px;
  background: ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.white)};
  color: ${({ $selected }) => ($selected ? theme.colors.white : theme.colors.gray600)};
  font-size: 9px;
  font-weight: 850;

  &:disabled {
    opacity: 0.45;
  }
`;

export const CandidateActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;

  > :only-child {
    grid-column: 1 / -1;
  }
`;

export const EmptyMessage = styled.div`
  min-height: 94px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  text-align: center;

  strong {
    color: ${theme.colors.gray900};
    font-size: 13px;
    font-weight: 900;
  }

  span {
    color: ${theme.colors.gray500};
    font-size: 10px;
    font-weight: 650;
  }
`;

export const ErrorText = styled.p`
  margin: 0;
  color: ${theme.colors.error};
  font-size: 9px;
  font-weight: 750;
  line-height: 1.45;
`;

export const FinalCard = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
  padding: 30px 20px 22px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 28px;
  background: ${theme.colors.white};
  text-align: center;
`;

export const FinalIcon = styled.span`
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  margin-bottom: 14px;
  border-radius: ${theme.radius.full};
  background: #eaf7f0;
  color: ${theme.colors.success};
`;

export const FinalEyebrow = styled.span`
  color: ${theme.colors.success};
  font-size: 9px;
  font-weight: 900;
`;

export const FinalTitle = styled.h2`
  margin: 5px 0 0;
  color: ${theme.colors.gray900};
  font-size: 23px;
  font-weight: 950;
  letter-spacing: -0.04em;
`;

export const FinalMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 9px;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 650;
  line-height: 1.45;
`;

export const FinalActions = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
  margin-top: 20px;
`;

export const Loading = styled.div`
  width: min(100%, ${theme.app.maxWidth});
  min-height: 70vh;
  display: grid;
  place-items: center;
  margin: 0 auto;
  padding: 24px;
  color: ${theme.colors.gray500};
  font-size: 12px;
  font-weight: 800;
  text-align: center;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  strong {
    color: ${theme.colors.gray900};
  }

  button {
    min-height: 40px;
    padding: 0 13px;
    border: 1px solid ${theme.colors.gray200};
    border-radius: 12px;
    background: ${theme.colors.white};
    color: ${theme.colors.gray700};
    font-size: 10px;
    font-weight: 850;
  }
`;

export const ShortlistDock = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 90;
  width: min(100%, ${theme.app.maxWidth});
  transform: translateX(-50%);
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid ${theme.colors.gray100};
  background: color-mix(in srgb, ${theme.colors.white} 96%, transparent);
  box-shadow: 0 -10px 28px rgba(17, 19, 24, 0.08);
  backdrop-filter: blur(18px);
`;

export const ShortlistDockButton = styled.button`
  width: 100%;
  min-height: 62px;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 30px;
  align-items: center;
  gap: 10px;
  padding: 9px 11px;
  border: 0;
  border-radius: 18px;
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  text-align: left;

  &:active {
    transform: scale(0.99);
  }
`;

export const ShortlistIcon = styled.span`
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.13);
`;

export const ShortlistDockText = styled.span`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;

  strong,
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    font-size: 12px;
    font-weight: 900;
  }

  span {
    color: rgba(255, 255, 255, 0.68);
    font-size: 9px;
    font-weight: 700;
  }
`;

export const ShortlistCount = styled.span`
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  justify-self: end;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.white};
  color: ${theme.colors.black};
  font-size: 11px;
  font-weight: 950;
`;

export const ShortlistIntro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 2px 12px;

  strong {
    color: ${theme.colors.gray900};
    font-size: 13px;
    font-weight: 900;
  }

  span {
    color: ${theme.colors.gray500};
    font-size: 10px;
    font-weight: 650;
    line-height: 1.5;
  }
`;

export const ShortlistList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ShortlistItem = styled.button<{ $selected: boolean }>`
  width: 100%;
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 11px;
  border: 1px solid ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.gray200)};
  border-radius: 15px;
  background: ${({ $selected }) => ($selected ? theme.colors.gray50 : theme.colors.white)};
  text-align: left;

  > span:first-of-type {
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
    font-weight: 900;
  }

  small {
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 650;
  }
`;

export const ShortlistStatus = styled.span<{ $ready: boolean }>`
  flex: 0 0 auto;
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  border-radius: ${theme.radius.full};
  background: ${({ $ready }) => ($ready ? '#EAF7F0' : theme.colors.gray100)};
  color: ${({ $ready }) => ($ready ? theme.colors.success : theme.colors.gray500)};
  font-size: 8px;
  font-weight: 900;
`;

export const ShortlistHint = styled.p`
  margin: 10px 2px 0;
  color: ${theme.colors.gray500};
  font-size: 9px;
  font-weight: 700;
  line-height: 1.5;
`;

export const ShortlistEmpty = styled.div`
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: ${theme.colors.gray400};
  text-align: center;

  strong {
    margin-top: 4px;
    color: ${theme.colors.gray900};
    font-size: 13px;
    font-weight: 900;
  }

  span {
    color: ${theme.colors.gray500};
    font-size: 10px;
    font-weight: 650;
  }
`;
