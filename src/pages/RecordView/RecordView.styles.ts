import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  min-height: 100dvh;
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 104px);
  background: ${theme.colors.gray50};
`;

export const HeaderRow = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  min-height: calc(env(safe-area-inset-top, 0px) + 68px);
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  align-items: center;
  padding: calc(env(safe-area-inset-top, 0px) + 9px) ${theme.app.pagePadding} 8px;
  background: rgba(250, 250, 251, 0.92);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
`;

export const BackButton = styled.button`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  margin-left: -10px;
  border-radius: 50%;
  color: ${theme.colors.black};
`;

export const HeaderCopy = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  > span {
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 700;
  }
`;

export const DateTitle = styled.h1`
  overflow: hidden;
  color: ${theme.colors.black};
  font-size: 17px;
  font-weight: 850;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HeaderActionSlot = styled.div`
  position: relative;
  width: 44px;
  height: 44px;
  justify-self: end;
`;

export const MoreButton = styled.button`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: ${theme.colors.black};
`;

export const ActionMenu = styled.div`
  position: absolute;
  top: 43px;
  right: 0;
  z-index: 80;
  width: 154px;
  overflow: hidden;
  padding: 6px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 17px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 12px 34px rgba(17, 19, 24, 0.14);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
`;

export const ActionMenuButton = styled.button<{ $danger?: boolean }>`
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  border-radius: 12px;
  color: ${({ $danger }) => ($danger ? theme.colors.error : theme.colors.black)};
  font-size: 12px;
  font-weight: 800;
  text-align: left;

  &:hover,
  &:focus-visible {
    background: ${({ $danger }) => ($danger ? '#FFF1F2' : theme.colors.gray100)};
  }

  &:disabled {
    opacity: 0.55;
  }
`;

export const Progress = styled.div`
  display: flex;
  gap: 5px;
  padding: 4px ${theme.app.pagePadding} 12px;
`;

export const ProgressItem = styled.i<{ $active: boolean }>`
  height: 4px;
  flex: 1;
  border-radius: ${theme.radius.full};
  background: ${({ $active }) => ($active ? theme.colors.black : theme.colors.gray200)};
  transition: background ${theme.motion.fast} ${theme.motion.easing};
`;

export const Album = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  overscroll-behavior-x: contain;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const RecordSlide = styled.article`
  width: 100%;
  flex: 0 0 100%;
  scroll-snap-align: start;
  padding: 0 ${theme.app.pagePadding};
`;

export const Hero = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 30px;
  background: ${theme.colors.gray200};
`;

export const RecordImage = styled.img`
  width: 100%;
  aspect-ratio: 4 / 5;
  max-height: 58dvh;
  display: block;
  object-fit: cover;
`;

export const HeroShade = styled.div`
  position: absolute;
  inset: 45% 0 0;
  background: linear-gradient(180deg, transparent, rgba(12, 14, 18, 0.78));
  pointer-events: none;
`;

export const PositionBadge = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  min-height: 29px;
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  border-radius: ${theme.radius.full};
  background: rgba(17, 19, 24, 0.62);
  color: ${theme.colors.white};
  font-size: 10px;
  font-weight: 800;
  backdrop-filter: blur(8px);
`;

export const HeroCopy = styled.div`
  position: absolute;
  right: 20px;
  bottom: 22px;
  left: 20px;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;

  color: ${theme.colors.white};
`;

export const RevisitLabel = styled.span`
  min-height: 27px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0 9px;
  border-radius: ${theme.radius.full};
  background: rgba(255, 255, 255, 0.18);
  color: ${theme.colors.white};
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
`;

export const FoodName = styled.h2`
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: clamp(24px, 5vw, 32px);
  font-weight: 800;
  letter-spacing: -0.055em;
  line-height: 1.12;
`;

export const MemoryCard = styled.section`
  display: flex;
  flex-direction: column;
  margin: 12px 0 0;
  padding: 4px 16px;
  border-radius: 25px;
  background: ${theme.colors.white};
`;

export const InfoRow = styled.div`
  min-height: 68px;
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid ${theme.colors.gray100};

  &:last-child {
    border-bottom: 0;
  }
`;

export const InfoIcon = styled.span`
  width: 30px;
  height: 40px;
  display: grid;
  place-items: center;
  color: ${theme.colors.gray600};
`;

export const InfoCopy = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  > strong,
  > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: ${theme.colors.black};
    font-size: 14px;
    font-weight: 850;
  }

  > span {
    color: ${theme.colors.gray500};
    font-size: 10px;
    font-weight: 650;
  }
`;

export const RestaurantLine = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  strong {
    min-width: 0;
    overflow: hidden;
    color: ${theme.colors.black};
    font-size: 14px;
    font-weight: 850;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const NaverMapLink = styled.a`
  flex: 0 0 auto;
  margin-right: 8px;

  color: ${theme.colors.gray500};
  font-size: 12px;
  font-weight: 750;
  text-decoration: underline;
  text-decoration-color: ${theme.colors.gray400};
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
`;
export const FloatingAddButton = styled.button`
  position: fixed;
  right: max(24px, calc((100vw - ${theme.app.maxWidth}) / 2 + 20px));
  bottom: calc(env(safe-area-inset-bottom, 0px) + 32px);
  z-index: 45;
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0 17px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  box-shadow: 0 10px 26px rgba(17, 19, 24, 0.22);
  font-size: 12px;
  font-weight: 850;

  &:disabled {
    background: ${theme.colors.gray300};
    color: ${theme.colors.gray500};
    box-shadow: none;
  }
`;

export const EmptyState = styled.div`
  min-height: calc(100dvh - 120px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px;
  color: ${theme.colors.gray500};
  font-size: 12px;
  text-align: center;

  strong {
    color: ${theme.colors.black};
    font-size: 18px;
    font-weight: 850;
  }
`;

export const EmptyEmoji = styled.span`
  margin-bottom: 5px;
  font-size: 44px;
`;

export const PrimaryButton = styled.button`
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 8px;
  padding: 0 18px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: 800;
`;
