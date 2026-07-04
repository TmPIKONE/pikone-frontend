import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Wrapper = styled.div`
  width: 100%;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const EmptyButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  aspect-ratio: 1;
  border: 1.5px dashed ${theme.colors.gray300};
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.gray100};
  color: ${theme.colors.gray500};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
`;

export const PreviewButton = styled.button`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border: none;
  border-radius: ${theme.radius.md};
  overflow: hidden;
  padding: 0;
  cursor: pointer;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const ChangeLabel = styled.span`
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 4px 10px;
  border-radius: ${theme.radius.full};
  background-color: rgba(0, 0, 0, 0.55);
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.xs};
`;
