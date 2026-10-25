import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Recovery = styled.div`
  min-height: 65vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: ${theme.colors.gray600};
  font-size: 14px;
  font-weight: 750;
  text-align: center;
`;

export const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
  min-height: 240px;
`;
export const MapFallback = styled.div`
  display: grid;
  place-content: center;
  gap: 8px;
  min-height: 240px;
  padding: 20px;
  text-align: center;
`;
export const MapFallbackLine = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 13px;
`;
