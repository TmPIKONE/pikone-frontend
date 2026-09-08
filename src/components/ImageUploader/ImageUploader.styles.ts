import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Wrapper = styled.div`
  width: 146px;
  max-width: 100%;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const EmptyButton = styled.button`
  width: 146px;
  max-width: 100%;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px dashed ${theme.colors.gray300};
  border-radius: 24px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray400};
  font-size: 11px;
  font-weight: 700;
`;

export const PreviewButton = styled.button`
  position: relative;
  width: 146px;
  max-width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  padding: 0;
  border-radius: 24px;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

export const ChangeLabel = styled.span`
  position: absolute;
  right: 8px;
  bottom: 8px;
  padding: 5px 9px;
  border-radius: ${theme.radius.full};
  background: rgba(0, 0, 0, 0.64);
  color: ${theme.colors.white};
  font-size: 9px;
  font-weight: 800;
`;

export const ValidationError = styled.p`
  width: 100%;
  margin-top: 10px;
  color: ${theme.colors.error};
  font-size: 11px;
  line-height: 1.45;
`;
