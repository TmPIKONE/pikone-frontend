import styled from '@emotion/styled';
import { formPrimitives } from '~/styles/formPrimitives';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  min-height: 100dvh;
  padding: calc(env(safe-area-inset-top, 0px) + 18px) ${theme.app.pagePadding} 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: ${theme.colors.white};
`;

export const Hero = styled.header`
  position: relative;
  overflow: hidden;
  padding: 24px 0;
  background: ${theme.colors.white};
`;

export const Title = styled.h1`
  max-width: 255px;
  margin-top: 9px;
  color: ${theme.colors.black};
  font-size: clamp(31px, 8vw, 39px);
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: -0.055em;
`;

export const UsageCard = styled.section<{ $exhausted: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 11px;
  padding: 17px 18px;
  border: 1px solid
    ${({ $exhausted }) => ($exhausted ? theme.colors.gray900 : theme.colors.gray200)};
  border-radius: 22px;
  background: ${({ $exhausted }) => ($exhausted ? theme.colors.gray900 : theme.colors.white)};
`;

export const UsageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const UsageText = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const UsageEyebrow = styled.span<{ $exhausted: boolean }>`
  color: ${({ $exhausted }) => ($exhausted ? 'rgba(255, 255, 255, 0.58)' : theme.colors.gray500)};
  font-size: 9px;
  font-weight: 800;
`;

export const UsageTitle = styled.strong<{ $exhausted: boolean }>`
  color: ${({ $exhausted }) => ($exhausted ? theme.colors.white : theme.colors.gray900)};
  font-size: 14px;
  font-weight: 850;
  letter-spacing: -0.025em;
`;

export const UsageCount = styled.span<{ $exhausted: boolean }>`
  flex-shrink: 0;
  padding: 6px 9px;
  border-radius: ${theme.radius.full};
  background: ${({ $exhausted }) =>
    $exhausted ? 'rgba(255, 255, 255, 0.12)' : theme.colors.gray100};
  color: ${({ $exhausted }) => ($exhausted ? theme.colors.white : theme.colors.gray700)};
  font-size: 10px;
  font-weight: 800;
`;

export const UsageDots = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
`;

export const UsageDot = styled.span<{ $used: boolean; $exhausted: boolean }>`
  height: 7px;
  border-radius: ${theme.radius.full};
  background: ${({ $used, $exhausted }) => {
    if ($exhausted) {
      return $used ? theme.colors.white : 'rgba(255, 255, 255, 0.2)';
    }
    return $used ? theme.colors.black : theme.colors.gray200;
  }};
`;

export const UsageHint = styled.span<{ $exhausted: boolean }>`
  color: ${({ $exhausted }) => ($exhausted ? 'rgba(255, 255, 255, 0.58)' : theme.colors.gray500)};
  font-size: 9px;
  font-weight: 600;
  line-height: 1.45;
`;

export const LocationSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 11px;
  padding: 17px 18px;
  border-radius: 22px;
  background: ${theme.colors.gray100};
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const SectionLabel = styled.strong`
  color: ${theme.colors.gray900};
  font-size: 12px;
  font-weight: 850;
`;

export const LocationValue = styled.span`
  max-width: 58%;
  overflow: hidden;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const LocationChipRow = styled.div`
  display: flex;
  gap: 7px;
  overflow-x: auto;
  padding-bottom: 1px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const LocationChip = styled.button<{ $selected: boolean }>`
  flex-shrink: 0;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0 13px;
  border: 1px solid ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.gray200)};
  border-radius: ${theme.radius.full};
  background: ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.white)};
  color: ${({ $selected }) => ($selected ? theme.colors.white : theme.colors.gray700)};
  font-size: 11px;
  font-weight: 750;

  &:disabled {
    border-color: ${theme.colors.gray200};
    background: ${theme.colors.gray200};
    color: ${theme.colors.gray500};
    cursor: not-allowed;
  }
`;

export const ProgressSection = styled.section`
  padding: 18px 20px;
  border-radius: 22px;
  background: ${theme.colors.gray100};
`;

export const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  strong {
    color: ${theme.colors.black};
    font-size: 12px;
    font-weight: 800;
  }
`;

export const ProgressBarTrack = styled.div`
  width: 100%;
  height: 7px;
  overflow: hidden;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray300};
`;

export const ProgressBarFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  transition: width 0.28s ${theme.motion.easing};
`;

export const ProgressLabel = styled.span`
  color: ${theme.colors.black};
  font-size: 11px;
  font-weight: 850;
`;

export const LocationWarning = styled.div`
  padding: 12px 14px;
  border-radius: ${theme.radius.md};
  background: #fff6d8;
  color: #8b6208;
  font-size: 11px;
  font-weight: 650;
  line-height: 1.5;
`;

export const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Chip = styled.button<{ $selected: boolean }>`
  min-height: 42px;
  padding: 0 15px;
  border: 1px solid ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.gray200)};
  border-radius: ${theme.radius.full};
  background: ${({ $selected }) => ($selected ? theme.colors.black : theme.colors.white)};
  color: ${({ $selected }) => ($selected ? theme.colors.white : theme.colors.gray700)};
  font-size: 12px;
  font-weight: ${({ $selected }) => ($selected ? 800 : 650)};

  &:active {
    transform: scale(0.97);
  }
`;

export const OptionalHint = styled.span`
  margin-top: 2px;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 600;
`;

export const ConfirmButton = styled.button`
  min-height: 44px;
  align-self: flex-start;
  padding: 0 17px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: 800;
`;

export const PreferenceCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 19px;
  padding: 21px 18px;
  border-radius: 24px;
  background: ${theme.colors.gray100};
`;

export const PreferenceTitle = styled.h2`
  color: ${theme.colors.gray900};
  font-size: 15px;
  font-weight: 850;
  letter-spacing: -0.025em;
`;

export const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

export const OptionLabel = styled.strong`
  color: ${theme.colors.gray700};
  font-size: 11px;
  font-weight: 800;
`;

export const OptionalText = styled.span`
  margin-left: 3px;
  color: ${theme.colors.gray400};
  font-size: 9px;
  font-weight: 700;
`;

export const SubmitButton = styled.button`
  ${formPrimitives.primaryAction}
  min-height: 56px;
  margin-top: 4px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  font-size: 14px;
  font-weight: 850;
`;

export const ErrorText = styled.p`
  color: ${theme.colors.error};
  font-size: 11px;
  font-weight: 650;
`;

export const DestinationPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 2px;
`;

export const DestinationSearchBox = styled.div`
  min-height: 46px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 13px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 15px;
  background: ${theme.colors.white};
  color: ${theme.colors.gray500};

  &:focus-within {
    border-color: ${theme.colors.black};
  }
`;

export const DestinationInput = styled.input`
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${theme.colors.gray900};
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;

  &::placeholder {
    color: ${theme.colors.gray400};
    font-weight: 600;
  }
`;

export const ClearSearchButton = styled.button`
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray500};
`;

export const DestinationHint = styled.p`
  margin: 0 2px;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 600;
  line-height: 1.5;
`;

export const DestinationStatus = styled.p`
  margin: 2px 0;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 650;
  line-height: 1.45;
`;

export const DestinationResultList = styled.div`
  overflow: hidden;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 16px;
  background: ${theme.colors.white};
`;

export const DestinationResultButton = styled.button`
  width: 100%;
  min-height: 58px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  text-align: left;

  & + & {
    border-top: 1px solid ${theme.colors.gray100};
  }

  &:active {
    background: ${theme.colors.gray50};
  }
`;

export const ResultLocationIcon = styled.span`
  flex-shrink: 0;
  width: 31px;
  height: 31px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray700};
`;

export const DestinationResultText = styled.span`
  min-width: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;

  strong {
    overflow: hidden;
    color: ${theme.colors.gray900};
    font-size: 12px;
    font-weight: 800;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    overflow: hidden;
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const SelectedDestination = styled.div`
  min-height: 62px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 11px;
  border: 1px solid ${theme.colors.black};
  border-radius: 16px;
  background: ${theme.colors.white};
`;

export const SelectedDestinationIcon = styled.span`
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
`;

export const SelectedDestinationText = styled.span`
  min-width: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;

  strong {
    overflow: hidden;
    color: ${theme.colors.gray900};
    font-size: 12px;
    font-weight: 850;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    overflow: hidden;
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ChangeDestinationButton = styled.button`
  flex-shrink: 0;
  min-height: 32px;
  padding: 0 10px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray700};
  font-size: 10px;
  font-weight: 800;
`;

export const RecentDestinationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const RecentDestinationLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${theme.colors.gray500};
  font-size: 9px;
  font-weight: 750;
`;

export const RecentDestinationRow = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const RecentDestinationChip = styled.button`
  flex-shrink: 0;
  min-height: 32px;
  padding: 0 11px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.full};
  background: ${theme.colors.white};
  color: ${theme.colors.gray700};
  font-size: 10px;
  font-weight: 700;
`;
