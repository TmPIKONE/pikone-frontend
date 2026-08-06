import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  color: ${theme.colors.black};
  font-size: clamp(30px, 8vw, 39px);
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.06em;
`;

export const Description = styled.p`
  margin-top: 18px;
  color: ${theme.colors.gray400};
  font-size: 13px;
  font-weight: 650;
  line-height: 1.5;
`;

export const Field = styled.div`
  margin-top: 36px;
`;

export const Label = styled.strong`
  display: block;
  margin-bottom: 16px;
  color: ${theme.colors.gray500};
  font-size: 15px;
  font-weight: 800;
`;

export const Guide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 20px;
  padding: 22px;
  border-radius: 23px;
  background: ${theme.colors.gray100};

  strong {
    color: ${theme.colors.black};
    font-size: 14px;
    font-weight: 850;
  }

  span {
    color: ${theme.colors.gray500};
    font-size: 11px;
    font-weight: 600;
    line-height: 1.5;
  }
`;

export const NextButton = styled.button`
  width: 100%;
  min-height: 64px;
  margin-top: 24px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 15px;
  font-weight: 850;

  &:disabled {
    background: ${theme.colors.gray100};
    color: ${theme.colors.gray400};
  }
`;

export const LocationStatus = styled.p`
  margin-top: 14px;
  color: ${theme.colors.gray400};
  font-size: 10px;
  font-weight: 650;
  text-align: center;
`;
