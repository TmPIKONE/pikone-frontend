import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Section = styled.section`
  display: flex;
  align-items: flex-start;
  gap: clamp(1px, 1vw, 1px);
  padding: 8px ${theme.app.pagePadding} 16px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const PersonButton = styled.button`
  width: 76px;
  flex: 0 0 76px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #93959b;
  text-align: center;

  &:active > span:first-of-type {
    transform: scale(0.96);
  }
`;

export const Avatar = styled.span<{ $add?: boolean }>`
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 999px;
  background: ${({ $add }) => ($add ? '#cfd0d5' : '#d0d1d5')};
  color: #f7f7f8;
  transition: transform ${theme.motion.fast} ${theme.motion.easing};
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

export const Label = styled.span`
  width: 100%;
  overflow: hidden;
  color: #92949a;
  font-size: 13px;
  font-weight: 740;
  letter-spacing: -0.045em;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
