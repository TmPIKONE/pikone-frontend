import styled from '@emotion/styled';
import { formPrimitives } from '~/styles/formPrimitives';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  min-height: 100dvh;
  padding: calc(env(safe-area-inset-top, 0px) + 18px) ${theme.app.pagePadding} 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: ${theme.colors.white};
`;

export const Hero = styled.header`
  position: relative;
  overflow: hidden;
  min-height: 210px;
  padding: 36px 0 22px;
  background: ${theme.colors.white};
`;

export const HeroVisual = styled.div`
  position: absolute;
  top: 31px;
  right: 0;
  width: 74px;
  height: 74px;
  display: grid;
  place-items: center;
  border-radius: 23px;
  background: #e8f2f5;
  font-size: 34px;
  transform: rotate(7deg);
`;

export const Eyebrow = styled.span`
  color: #69a9b9;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.08em;
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

export const Description = styled.p`
  max-width: 285px;
  margin-top: 13px;
  color: ${theme.colors.gray600};
  font-size: 12px;
  font-weight: 600;
  line-height: 1.55;
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
  background: ${theme.colors.gray100};
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

export const Field = styled.div`
  ${formPrimitives.field}
`;

export const Label = styled.label`
  ${formPrimitives.label}
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

export const ConfirmButton = styled.button`
  min-height: 44px;
  align-self: flex-start;
  padding: 0 17px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: 800;

  &:disabled {
    background: ${theme.colors.gray300};
    cursor: not-allowed;
  }
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
