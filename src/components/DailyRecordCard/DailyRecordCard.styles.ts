import styled from '@emotion/styled';

export const Card = styled.button`
    position: relative;
    width: min(calc(100vw - 76px), 400px);
    aspect-ratio: 4 / 5;
    flex: 0 0 min(calc(100vw - 76px), 400px);
    overflow: hidden;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.84);
    border-radius: 25px;
    background: #dbeafe;
    scroll-snap-align: center;
    cursor: pointer;
    transform: translateZ(0);
    transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;

    &:active {
        transform: scale(0.987);
        box-shadow:
                0 15px 28px rgba(39, 77, 137, 0.15),
                0 4px 12px rgba(21, 37, 64, 0.08);
    }

    &:hover img {
        transform: scale(1.025);
    }

    @media (min-width: 520px) {
        width: 400px;
        flex-basis: 400px;
    }
`;

export const Image = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

export const ImageFallback = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 28%;
  background:
    radial-gradient(circle at 72% 20%, rgba(255, 255, 255, 0.45), transparent 24%),
    linear-gradient(145deg, #a8c8f7 0%, #6f9fdf 100%);
`;

export const Shade = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(5, 14, 30, 0) 43%,
    rgba(5, 14, 30, 0.05) 56%,
    rgba(5, 14, 30, 0.26) 72%,
    rgba(5, 14, 30, 0.84) 100%
  );
  pointer-events: none;
`;

export const Meta = styled.div`
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 22px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 7px;
  color: #ffffff;
  text-align: left;
`;

export const Date = styled.span`
  color: rgba(255, 255, 255, 0.88);
  font-size: 12px;
  font-weight: 760;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.42);
`;

export const Location = styled.strong`
  width: 100%;
  overflow: hidden;
  color: #ffffff;
  font-size: clamp(21px, 5.8vw, 27px);
  font-weight: 860;
  line-height: 1.22;
  letter-spacing: -0.045em;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: 0 3px 15px rgba(0, 0, 0, 0.5);
`;
