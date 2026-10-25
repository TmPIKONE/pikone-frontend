import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const MapViewport = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 18px;
  background: ${theme.colors.gray100};
  isolation: isolate;
`;

export const MapCanvas = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

export const Pin = styled.div`
  position: absolute;
  z-index: 5;
  left: 50%;
  top: 50%;
  display: grid;
  place-items: center;
  color: #f0643b;
  filter: drop-shadow(0 3px 5px rgba(240, 100, 59, 0.3));
  transform: translate(-50%, calc(-100% + 5px));
  pointer-events: none;

  svg {
    fill: currentColor;
    stroke: ${theme.colors.white};
  }
`;

export const MapHint = styled.span`
  position: absolute;
  z-index: 6;
  top: 10px;
  left: 50%;
  max-width: calc(100% - 100px);
  padding: 7px 11px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: ${theme.radius.full};
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 14px rgba(17, 24, 39, 0.08);
  color: ${theme.colors.gray700};
  font-size: 10px;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
  transform: translateX(-50%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  pointer-events: none;
`;

export const CurrentLocationButton = styled.button`
  position: absolute;
  z-index: 7;
  right: 11px;
  bottom: 11px;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(17, 24, 39, 0.1);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 5px 16px rgba(17, 24, 39, 0.14);
  color: ${theme.colors.navy};
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:disabled {
    color: ${theme.colors.gray300};
    cursor: default;
  }
`;

export const MapFallback = styled.div`
  min-height: 180px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 18px;
  background: ${theme.colors.gray50};
  color: ${theme.colors.gray500};
  text-align: center;

  svg {
    margin-bottom: 3px;
    color: ${theme.colors.sky};
    fill: currentColor;
  }

  strong {
    color: ${theme.colors.gray700};
    font-size: 14px;
  }

  span {
    max-width: 260px;
    font-size: 12px;
    line-height: 1.5;
  }
`;
