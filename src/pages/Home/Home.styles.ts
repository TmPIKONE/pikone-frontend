import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  padding: 20px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const GreetingSection = styled.section`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: ${theme.radius.full};
  object-fit: cover;
  background-color: ${theme.colors.gray200};
`;

export const GreetingTextBox = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Nickname = styled.span`
  font-size: 18px;
  font-weight: ${theme.fontWeights.semibold};
`;

export const GreetingSub = styled.span`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.regular};
  color: ${theme.colors.gray500};
`;

export const DraftBanner = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
`;

export const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: ${theme.fontWeights.semibold};
  margin-bottom: 12px;
`;

export const RecordList = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const RecordCard = styled.button`
  flex: 0 0 auto;
  width: 120px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
`;

export const RecordThumbnail = styled.img`
  width: 120px;
  height: 120px;
  border-radius: ${theme.radius.md};
  object-fit: cover;
  background-color: ${theme.colors.gray200};
`;

export const RecordDate = styled.p`
  margin-top: 6px;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray500};
`;

export const RecordCompanion = styled.p`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.regular};
`;

export const EmptyState = styled.div`
  padding: 32px 0;
  text-align: center;
  color: ${theme.colors.gray500};
  font-size: ${theme.fontSizes.xs};
`;

export const FloatingButton = styled.button`
  position: fixed;
  right: max(20px, calc((100vw - ${theme.app.maxWidth}) / 2 + 20px));
  bottom: calc(${theme.nav.height} + 20px);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 10;
`;
