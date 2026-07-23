import styled from '@emotion/styled';

export const Section = styled.section`
    position: relative;
    overflow: hidden;
    background: #faf8f8;
    padding: 12px;
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
`;

export const Meadow = styled.div`
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 0;

    width: 100vw;
    height: 112px;

    overflow: hidden;
    pointer-events: none;
    transform: translateX(-50%);

    svg {
        width: 100%;
        height: 100%;
        display: block;
    }
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const Heading = styled.div`
  min-width: 0;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;

`;

export const Title = styled.h2`
    margin: 0;
    color: #4e5d7a;
    padding: 0 10px;
    font-size: 22px;
    font-weight: 880;
    line-height: 1.2;
    letter-spacing: -0.045em;
`;

export const Count = styled.span`
  min-width: 25px;
  min-height: 25px;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: #e4efff;
  color: #3f6daa;
  font-size: 10px;
  font-weight: 850;
`;

export const CalendarButton = styled.button`
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 0 8px;
  border: 0;
  background: transparent;
  color: #7588a5;
  font-size: 11px;
  font-weight: 760;

  &:active {
    opacity: 0.6;
  }
`;

export const List = styled.div<{ $hasMultiple: boolean }>`
  display: flex;
  justify-content: ${({ $hasMultiple }) =>
  $hasMultiple ? 'flex-start' : 'center'};
  gap: 14px;
  width: calc(100% + 18px);
  margin-left: ${({ $hasMultiple }) => ($hasMultiple ? '-9px' : '-9px')};
  padding: ${({ $hasMultiple }) =>
  $hasMultiple ? '0 18px 8px 9px' : '0 9px 8px'};
  overflow-x: ${({ $hasMultiple }) =>
  $hasMultiple ? 'auto' : 'hidden'};
  scroll-padding-left: 9px;
  scroll-snap-type: ${({ $hasMultiple }) =>
  $hasMultiple ? 'x mandatory' : 'none'};
  scrollbar-width: none;
  overscroll-behavior-inline: contain;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const SkeletonList = styled.div`
  display: flex;
  gap: 14px;
  margin: 0 -18px;
  padding: 0 18px 8px;
  overflow: hidden;
`;

export const Skeleton = styled.div`
  width: min(calc(100vw - 56px), 420px);
  aspect-ratio: 4 / 5;
  flex: 0 0 min(calc(100vw - 56px), 420px);
  border-radius: 30px;
  background: #ffffff;
  background-size: 220% 100%;
  animation: daily-record-shimmer 1.4s linear infinite;

  @keyframes daily-record-shimmer {
    from {
      background-position: 100% 0;
    }
    to {
      background-position: -100% 0;
    }
  }
`;

export const Empty = styled.div`
    min-height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    background: #ffffff;
    color: #244a7c;
    text-align: center;
`;

export const EmptyVisual = styled.div`
  width: 126px;
`;

export const EmptyCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 12px;

  strong {
    font-size: 20px;
    font-weight: 860;
    letter-spacing: -0.04em;
  }

  span {
    color: #6982a8;
    font-size: 12px;
    font-weight: 650;
    line-height: 1.55;
  }
`;

export const EmptyAction = styled.button`
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 18px;
  padding: 0 16px;
  border-radius: 999px;
  background: #2f66b7;
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;

  &:active {
    transform: scale(0.98);
  }
`;

export const ErrorBox = styled.div`
  min-height: 180px;
  display: grid;
  place-items: center;
  padding: 24px;
  border: 1px solid #dae6f7;
  border-radius: 26px;
  background: #f7faff;
  color: #60789b;
  text-align: center;

  strong {
    display: block;
    margin-bottom: 10px;
    color: #2f4f7f;
    font-size: 15px;
  }

  button {
    min-height: 38px;
    padding: 0 15px;
    border-radius: 999px;
    background: #315f9e;
    color: #ffffff;
    font-size: 11px;
    font-weight: 780;
  }
`;
