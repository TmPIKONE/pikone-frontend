import styled from '@emotion/styled';
import type { HomeCardTone } from './HomeQuickMenu.types';

const CARD_TONES: Record<
  HomeCardTone,
  {
    background: string;
    border: string;
    shadow: string;
  }
> = {
  peach: {
    background: '#5187c1',
    border: '#D6E7FF',
    shadow: '0 15px 30px rgba(59, 112, 196, 0.10)',
  },
  lavender: {
    background: '#5187c1',
    border: '#DEE2FF',
    shadow: '0 15px 30px rgba(88, 82, 170, 0.10)',
  },
  sky: {
    background: '#5187c1',
    border: '#DDEBFF',
    shadow: '0 15px 30px rgba(70, 111, 177, 0.09)',
  },
  mint: {
    background: '#5187c1',
    border: '#D8ECEC',
    shadow: '0 15px 30px rgba(55, 111, 119, 0.09)',
  },
};

export const Section = styled.section`
    margin: 0 -18px;
    padding: 24px 32px calc(120px + env(safe-area-inset-bottom));
    background: #88AAD0;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

export const Card = styled.button<{ $tone: HomeCardTone }>`
  min-width: 0;
  min-height: 205px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  border: none;
  border-radius: 26px;
  background: ${({ $tone }) => CARD_TONES[$tone].background};
  box-shadow: ${({ $tone }) => CARD_TONES[$tone].shadow};
  color: #244a7c;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:active {
    transform: scale(0.978);
  }

  @media (max-width: 370px) {
    min-height: 192px;
    padding: 16px;
    border-radius: 23px;
  }
`;

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

export const Illustration = styled.div`
  width: 94px;
  max-width: 75%;
`;

export const Plus = styled.span`
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    color: #f4f5f6;
    font-size: 32px;
    font-weight: 350;
    line-height: 1;
`;

export const Text = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;

    strong {
        color: #f6f3f3;
        font-size: 17px;
        font-weight: 850;
        letter-spacing: -0.035em;
    }

    span {
        color: #e7e7ed;
        font-size: 10px;
        font-weight: 650;
        line-height: 1.5;
        white-space: pre-line;
    }
`;
