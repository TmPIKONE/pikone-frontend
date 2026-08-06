import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding-top: 10px;
`;

export const PhotoSection = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  background: ${theme.colors.gray100};
`;

export const Photo = styled.img`
  width: 100%;
  aspect-ratio: 16 / 10;
  display: block;
  object-fit: cover;
`;

export const PhotoChangeButton = styled.label`
  position: absolute;
  right: 12px;
  bottom: 12px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 13px;
  border-radius: ${theme.radius.full};
  background: rgba(17, 19, 24, 0.78);
  color: ${theme.colors.white};
  font-size: 10px;
  font-weight: 800;
  cursor: pointer;

  input {
    display: none;
  }
`;

export const ErrorText = styled.p`
  margin-top: -13px;
  color: ${theme.colors.error};
  font-size: 10px;
  font-weight: 700;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

export const Label = styled.label`
  color: ${theme.colors.black};
  font-size: 12px;
  font-weight: 850;
`;

export const Input = styled.input`
  width: 100%;
  min-height: 54px;
  padding: 0 16px;
  border-radius: 17px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.black};
  font-size: 15px;
  font-weight: 750;
`;

export const DateButton = styled.button`
  min-height: 54px;
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) 20px;
  align-items: center;
  gap: 9px;
  padding: 0 15px;
  border-radius: 17px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.black};
  font-size: 13px;
  font-weight: 750;
  text-align: left;
`;

export const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
`;

export const TypeButton = styled.button<{ $active: boolean }>`
  min-height: 44px;
  border: 1px solid ${({ $active }) => ($active ? theme.colors.black : theme.colors.gray200)};
  border-radius: 14px;
  background: ${({ $active }) => ($active ? theme.colors.black : theme.colors.white)};
  color: ${({ $active }) => ($active ? theme.colors.white : theme.colors.gray700)};
  font-size: 11px;
  font-weight: 800;
`;

export const ToggleGroup = styled.div`
  overflow: hidden;
  padding: 0 15px;
  border-radius: 20px;
  background: ${theme.colors.gray100};
`;

export const ToggleRow = styled.div`
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${theme.colors.white};

  &:last-child {
    border-bottom: 0;
  }

  > span {
    color: ${theme.colors.black};
    font-size: 12px;
    font-weight: 750;
  }
`;
