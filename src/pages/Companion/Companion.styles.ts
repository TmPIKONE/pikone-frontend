import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  min-height: 100dvh;
  padding: calc(env(safe-area-inset-top, 0px) + 30px) ${theme.app.pagePadding} 180px;
  background: ${theme.colors.white};
`;

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
`;

export const Eyebrow = styled.span`
  display: block;
  margin-bottom: 6px;
  color: ${theme.colors.gray400};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.1em;
`;

export const PageTitle = styled.h1`
  color: ${theme.colors.black};
  font-size: 30px;
  font-weight: 950;
  letter-spacing: -0.06em;
`;

export const DecisionSection = styled.section`
  margin-top: 24px;
  padding: 18px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.xl};
  background: ${theme.colors.white};
`;

export const DecisionSectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

export const DecisionRoomList = styled.div`
  overflow: hidden;
  border: 1px solid ${theme.colors.gray100};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.gray50};
`;

export const DecisionRoomButton = styled.button`
  width: 100%;
  min-height: 62px;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  color: ${theme.colors.gray500};
  text-align: left;

  & + & {
    border-top: 1px solid ${theme.colors.gray100};
  }

  > span {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    overflow: hidden;
    color: ${theme.colors.gray900};
    font-size: 12px;
    font-weight: 900;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    overflow: hidden;
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const DecisionRoomIcon = styled.span`
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  justify-self: center;
  line-height: 0;
  border-radius: 13px;
  background: ${theme.colors.white};
  color: ${theme.colors.black};

  > svg {
    display: block;
    flex: 0 0 auto;
  }

  > .decision-room-pin {
    transform: translateY(2px);
  }
`;

export const DecisionEmpty = styled.div`
  min-height: 76px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.gray50};
  color: ${theme.colors.gray500};
  font-size: 11px;
  font-weight: 700;
`;

export const DecisionActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;

  @media (max-width: 360px) {
    grid-template-columns: 1fr;
  }
`;

const decisionActionButton = `
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 12px;
  border-radius: ${theme.radius.lg};
  font-size: 10px;
  font-weight: 850;
`;

export const DecisionPrimaryButton = styled.button`
  ${decisionActionButton}
  background: ${theme.colors.black};
  color: ${theme.colors.white};
`;

export const DecisionSecondaryButton = styled.button<{ $active: boolean }>`
  ${decisionActionButton}
  border: 1px solid ${({ $active }) => ($active ? theme.colors.gray700 : theme.colors.gray200)};
  background: ${({ $active }) => ($active ? theme.colors.gray100 : theme.colors.white)};
  color: ${theme.colors.gray700};
`;

export const JoinRoomForm = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid ${theme.colors.gray100};
`;

export const JoinRoomInput = styled.input`
  min-width: 0;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.lg};
  outline: 0;
  background: ${theme.colors.gray50};
  color: ${theme.colors.gray900};
  font: inherit;
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  &:focus {
    border-color: ${theme.colors.gray700};
    background: ${theme.colors.white};
  }
`;

export const JoinRoomButton = styled.button`
  min-height: 44px;
  padding: 0 14px;
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 11px;
  font-weight: 850;

  &:disabled {
    opacity: 0.4;
  }
`;

export const JoinRoomError = styled.p`
  grid-column: 1 / -1;
  margin: 0;
  color: ${theme.colors.error};
  font-size: 10px;
  font-weight: 750;
`;

export const CodeCard = styled.section`
  margin-top: 18px;
  padding: 22px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  border-radius: ${theme.radius.xl};
  background: ${theme.colors.gray100};
`;

export const CodeCopy = styled.div`
  min-width: 0;
`;

export const CodeLabel = styled.span`
  display: block;
  margin-bottom: 6px;
  color: ${theme.colors.gray500};
  font-size: 11px;
  font-weight: 800;
`;

export const CodeValue = styled.strong`
  display: block;
  color: ${theme.colors.black};
  font-size: 25px;
  font-weight: 950;
  letter-spacing: 0.14em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
`;

export const CopyButton = styled.button`
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0 15px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: 850;

  &:disabled {
    background: ${theme.colors.gray300};
    cursor: not-allowed;
  }
`;

export const CodeDescription = styled.p`
  grid-column: 1 / -1;
  padding-top: 15px;
  border-top: 1px solid ${theme.colors.gray200};
  color: ${theme.colors.gray600};
  font-size: 12px;
  font-weight: 650;
  line-height: 1.55;
`;

export const Section = styled.section`
  margin-top: 38px;
`;

export const SectionHeader = styled.div`
  min-height: 30px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 15px;
`;

export const SectionTitle = styled.h2`
  color: ${theme.colors.black};
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.04em;
`;

export const SectionDescription = styled.p`
  margin-top: 5px;
  color: ${theme.colors.gray500};
  font-size: 11px;
  font-weight: 650;
`;

export const CountBadge = styled.span`
  min-width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 11px;
  font-weight: 900;
`;

export const CountText = styled.span`
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  padding: 0 11px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
  font-size: 11px;
  font-weight: 850;
`;

export const RequestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RequestCard = styled.article`
  min-width: 0;
  padding: 15px;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  align-items: center;
  gap: 11px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.white};

  @media (max-width: 380px) {
    grid-template-columns: 42px minmax(0, 1fr);
  }
`;

export const RequestAvatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: ${theme.radius.full};
  object-fit: cover;
  background: ${theme.colors.gray100};
`;

export const RequestInitial = styled.span`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.black};
  font-size: 15px;
  font-weight: 900;
`;

export const RequestText = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    overflow: hidden;
    color: ${theme.colors.black};
    font-size: 14px;
    font-weight: 850;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    overflow: hidden;
    color: ${theme.colors.gray500};
    font-size: 10px;
    font-weight: 650;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const RequestActions = styled.div`
  display: flex;
  gap: 6px;

  @media (max-width: 380px) {
    grid-column: 1 / -1;
    padding-top: 3px;

    > button {
      flex: 1;
    }
  }
`;

const requestButton = `
  min-height: 38px;
  padding: 0 13px;
  border-radius: ${theme.radius.full};
  font-size: 11px;
  font-weight: 850;

  &:disabled {
    opacity: 0.45;
    cursor: wait;
  }
`;

export const AcceptButton = styled.button`
  ${requestButton}
  background: ${theme.colors.black};
  color: ${theme.colors.white};
`;

export const RejectButton = styled.button`
  ${requestButton}
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
`;

export const CompanionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CompanionCard = styled.article`
  overflow: hidden;
  padding: 17px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.xl};
  background: ${theme.colors.white};
`;

export const CompanionHeader = styled.div`
  min-width: 0;
  display: grid;
  grid-template-columns: 50px minmax(0, 1fr) 40px;
  align-items: center;
  gap: 12px;
`;

export const CompanionAvatar = styled.span<{ $linked: boolean }>`
  position: relative;
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.full};
  background: ${({ $linked }) => ($linked ? theme.colors.black : theme.colors.gray100)};
  color: ${({ $linked }) => ($linked ? theme.colors.white : theme.colors.black)};
  font-size: 17px;
  font-weight: 950;

  &::after {
    content: '';
    position: absolute;
    right: 1px;
    bottom: 1px;
    width: 11px;
    height: 11px;
    border: 3px solid ${theme.colors.white};
    border-radius: ${theme.radius.full};
    background: ${({ $linked }) => ($linked ? '#55D887' : theme.colors.gray300)};
  }
`;

export const CompanionInfo = styled.div`
  min-width: 0;
`;

export const CompanionName = styled.strong`
  display: block;
  overflow: hidden;
  color: ${theme.colors.black};
  font-size: 16px;
  font-weight: 900;
  letter-spacing: -0.03em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CompanionMeta = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 5px;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 700;
`;

export const RelationshipLabel = styled.span`
  min-height: 21px;
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray700};
  font-size: 9px;
  font-weight: 850;
`;

export const LinkedNickname = styled.span`
  display: block;
  margin-top: 5px;
  overflow: hidden;
  color: ${theme.colors.gray400};
  font-size: 10px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MoreButton = styled.button`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray600};

  &:active {
    transform: scale(0.96);
  }
`;

export const RecordButton = styled.button`
  width: 100%;
  min-height: 58px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 14px;
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.gray100};
  color: ${theme.colors.black};
  text-align: left;

  > span {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
    color: ${theme.colors.gray500};
    font-size: 10px;
    font-weight: 650;
  }

  strong {
    color: ${theme.colors.black};
    font-size: 12px;
    font-weight: 900;
  }

  svg {
    flex: 0 0 auto;
  }
`;

export const PlanButton = styled.button`
  width: 100%;
  min-height: 52px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.white};
  color: ${theme.colors.black};
  text-align: left;

  > span {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
    color: ${theme.colors.gray500};
    font-size: 10px;
    font-weight: 650;
  }

  strong {
    color: ${theme.colors.black};
    font-size: 12px;
    font-weight: 900;
  }

  svg {
    flex: 0 0 auto;
  }
`;

export const ManagementPanel = styled.div`
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid ${theme.colors.gray200};
`;

export const ManagementActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

export const ManagementButton = styled.button`
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray700};
  font-size: 11px;
  font-weight: 800;
`;

export const DeleteButton = styled(ManagementButton)`
  background: #fff2f2;
  color: ${theme.colors.error};
`;

export const NameEditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

export const NameEditLabel = styled.label`
  color: ${theme.colors.gray600};
  font-size: 11px;
  font-weight: 800;
`;

export const NameEditRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
`;

export const NameEditInput = styled.input`
  min-width: 0;
  min-height: 46px;
  padding: 0 14px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.white};
  color: ${theme.colors.black};
  font-size: 14px;
  font-weight: 750;

  &:focus {
    border-color: ${theme.colors.black};
  }
`;

export const SaveButton = styled.button`
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 11px;
  font-weight: 850;

  &:disabled {
    background: ${theme.colors.gray300};
  }
`;

export const EmptyState = styled.div`
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 28px;
  border-radius: ${theme.radius.xl};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray400};
  text-align: center;

  strong {
    margin-top: 5px;
    color: ${theme.colors.black};
    font-size: 14px;
    font-weight: 900;
  }

  span {
    max-width: 250px;
    color: ${theme.colors.gray500};
    font-size: 11px;
    font-weight: 650;
    line-height: 1.6;
  }
`;

export const EmptyIcon = styled.span`
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.white};
  color: ${theme.colors.black};
`;

export const RetryButton = styled.button`
  min-height: 40px;
  margin-top: 5px;
  padding: 0 14px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 11px;
  font-weight: 850;
`;

export const SkeletonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SkeletonCard = styled.div`
  height: 145px;
  border-radius: ${theme.radius.xl};
  background: linear-gradient(
    100deg,
    ${theme.colors.gray100} 22%,
    ${theme.colors.gray50} 38%,
    ${theme.colors.gray100} 54%
  );
  background-size: 220% 100%;
  animation: companion-shimmer 1.25s linear infinite;

  @keyframes companion-shimmer {
    to {
      background-position-x: -220%;
    }
  }
`;

export const BottomActions = styled.div`
  position: fixed;
  left: 50%;
  bottom: calc(96px + env(safe-area-inset-bottom, 0px));
  z-index: 70;
  width: min(calc(100% - 28px), 452px);
  padding: 7px;
  border: 1px solid rgba(17, 19, 24, 0.08);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 30px rgba(17, 19, 24, 0.13);
  backdrop-filter: blur(18px);
  transform: translateX(-50%);
`;

export const AddButton = styled.button`
  width: 100%;
  min-height: 58px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border-radius: 18px;
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 13px;
  font-weight: 900;

  &:active {
    transform: scale(0.985);
  }
`;

export const SectionTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  margin-top: 18px;
  padding: 4px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
`;

export const SectionTab = styled.button<{ $active: boolean }>`
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 14px;
  border-radius: ${theme.radius.full};
  background: ${({ $active }) => ($active ? theme.colors.white : 'transparent')};
  color: ${({ $active }) => ($active ? theme.colors.black : theme.colors.gray500)};
  box-shadow: ${({ $active }) => ($active ? '0 2px 8px rgba(0,0,0,.06)' : 'none')};
  font-size: 12px;
  font-weight: 900;

  svg {
    flex: 0 0 auto;
    transform: translateY(-0.5px);
  }

  span {
    line-height: 1;
  }
`;

export const AppointmentDock = styled.div`
  position: fixed;
  left: 50%;
  bottom: calc(94px + env(safe-area-inset-bottom, 0px));
  z-index: 70;
  width: min(calc(100% - 28px), 452px);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transform: translateX(-50%);
`;

export const AppointmentActionBar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(108px, 0.72fr);
  gap: 8px;
  padding: 7px;
  border: 1px solid rgba(17, 19, 24, 0.08);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 30px rgba(17, 19, 24, 0.13);
  backdrop-filter: blur(18px);
`;

export const AppointmentCreateButton = styled.button`
  min-width: 0;
  min-height: 58px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 0 18px;
  border-radius: 18px;
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 13px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;

  &:active {
    transform: scale(0.985);
  }
`;

export const ActionIcon = styled.span`
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  border-radius: ${theme.radius.full};
  background: rgba(255, 255, 255, 0.14);
  line-height: 0;

  svg {
    display: block;
    margin: 0;
    transform: none;
  }
`;

export const AppointmentJoinButton = styled.button<{ $active: boolean }>`
  min-width: 0;
  min-height: 58px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 12px;
  border: 1px solid ${({ $active }) => ($active ? theme.colors.black : theme.colors.gray200)};
  border-radius: 18px;
  background: ${({ $active }) => ($active ? theme.colors.black : theme.colors.white)};
  color: ${({ $active }) => ($active ? theme.colors.white : theme.colors.gray700)};
  font-size: 11px;
  font-weight: 850;
  white-space: nowrap;

  svg {
    flex: 0 0 auto;
  }

  &:active {
    transform: scale(0.975);
  }
`;

export const JoinRoomDockForm = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  padding: 10px;
  border: 1px solid rgba(17, 19, 24, 0.08);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 10px 28px rgba(17, 19, 24, 0.12);
  backdrop-filter: blur(18px);
`;
