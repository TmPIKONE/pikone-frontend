import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  min-height: 100dvh;
  padding: calc(env(safe-area-inset-top, 0px) + 30px) ${theme.app.pagePadding} 42px;
  background: ${theme.colors.white};
`;

export const HeaderRow = styled.header`
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 42px;
`;

export const BackButton = styled.button`
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  margin-left: -11px;
  color: ${theme.colors.black};
`;

export const StepLabel = styled.span`
  color: ${theme.colors.gray400};
  font-size: 13px;
  font-weight: 800;
`;

export const RecordLimitBanner = styled.div`
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  margin: -22px 0 28px;
  padding: 12px;
  border-radius: 20px;
  background: #fff4f4;
`;

export const RecordLimitIcon = styled.span`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: ${theme.colors.white};
  color: ${theme.colors.error};
`;

export const RecordLimitCopy = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;

  strong {
    color: ${theme.colors.black};
    font-size: 11px;
    font-weight: 850;
  }

  span {
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 650;
    line-height: 1.4;
  }
`;

export const ChangeDateButton = styled.button`
  min-height: 36px;
  padding: 0 11px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 9px;
  font-weight: 850;
  white-space: nowrap;
`;
