import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Page = styled.div`
  position: relative;
  min-height: 100dvh;
  background: #f5f5f3;
  color: #171717;
`;

export const TopBar = styled.header`
  position: fixed;
  top: 0;
  left: 50%;
  z-index: 20;
  width: min(100%, ${theme.app.maxWidth});
  padding: calc(env(safe-area-inset-top, 0px) + 14px) 16px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(245, 245, 243, 0.97);
  color: #171717;
  backdrop-filter: blur(12px);
  transform: translateX(-50%);
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
`;

export const Eyebrow = styled.span`
  display: block;
  margin-bottom: 3px;
  color: #777;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.16em;
`;

export const Title = styled.h1`
  margin: 0;
  color: #171717;
  font-size: clamp(20px, 5.8vw, 24px);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.055em;
`;

export const TopActions = styled.div`
  flex-shrink: 0;
  display: flex;
  gap: 6px;
`;

const topButton = `
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 850;
`;

export const SavedShortcut = styled.button<{ $active: boolean }>`
  ${topButton}
  border : 1px solid ${({ $active }) => ($active ? '#171717' : '#d7d7d2')};
  background: ${({ $active }) => ($active ? '#171717' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#171717')};
`;

export const FilterToggle = styled.button<{ $active: boolean }>`
  ${topButton}
  border : 1px solid ${({ $active }) => ($active ? '#171717' : '#d7d7d2')};
  background: ${({ $active }) => ($active ? '#171717' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#171717')};
`;

export const FilterPanel = styled.div`
  margin-top: 12px;
  padding: 14px;
  border: 1px solid #deded8;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(23, 23, 23, 0.07);
`;

export const FilterHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 11px;

  strong {
    color: #171717;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: -0.035em;
  }

  span {
    color: #85857f;
    font-size: 10px;
    font-weight: 650;
    line-height: 1.45;
  }
`;

export const RegionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 11px;
  border: 1px solid #d9d9d3;
  border-radius: 14px;
  background: #f8f8f6;
  color: #66665f;
`;

export const RegionInput = styled.input`
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #171717;
  font-size: 13px;
  font-weight: 750;
  &::placeholder {
    color: #999993;
  }
`;

export const RegionClear = styled.button`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: #66665f;

  &:active {
    background: #ecece8;
  }
`;

export const CreatorPicker = styled.div`
  margin-top: 10px;
`;

export const CreatorTrigger = styled.button`
  width: 100%;
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 12px 9px 14px;
  border: 1px solid #d9d9d3;
  border-radius: 14px;
  background: #fff;
  color: #171717;
  text-align: left;

  > svg {
    flex: 0 0 auto;
    color: #777770;
    transition: transform 160ms ease;
  }

  &:active {
    background: #f8f8f6;
  }
`;

export const CreatorTriggerCopy = styled.span`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;

  > span {
    color: #92928c;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.02em;
  }

  > strong {
    overflow: hidden;
    color: #171717;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: -0.035em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const CreatorMenu = styled.div`
  max-height: min(42dvh, 330px);
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 8px;
  padding: 6px;
  overflow-y: auto;
  border: 1px solid #e2e2dd;
  border-radius: 15px;
  background: #f8f8f6;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CreatorOption = styled.button<{ $active: boolean }>`
  width: 100%;
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 10px 9px 12px;
  border: 1px solid ${({ $active }) => ($active ? '#171717' : 'transparent')};
  border-radius: 11px;
  background: ${({ $active }) => ($active ? '#fff' : 'transparent')};
  color: #171717;
  text-align: left;

  > span {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  strong {
    overflow: hidden;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: -0.035em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    color: #83837d;
    font-size: 9px;
    font-weight: 650;
  }

  > svg {
    flex: 0 0 auto;
  }

  &:active {
    background: #efefeb;
  }
`;

export const Feed = styled.section`
  height: calc(100dvh - 86px - env(safe-area-inset-bottom));
  overflow-y: auto;
  padding: calc(env(safe-area-inset-top, 0px) + 92px) 12px 32px;
  overscroll-behavior-y: contain;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Card = styled.article`
  overflow: hidden;
  margin-bottom: 12px;
  border: 1px solid #e2e2dd;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.055);
`;

export const RestaurantPhoto = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #ecece8;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
`;

export const CardBody = styled.div`
  padding: 16px;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
  color: #70706b;
  font-size: 10px;
  font-weight: 800;
`;

export const CreatorBadge = styled.span``;

export const Distance = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #5f5f5a;
  font-size: 10px;
  font-weight: 800;
`;

export const RestaurantInfo = styled.div`
  min-width: 0;
`;

export const RestaurantName = styled.h2`
  margin: 0;
  color: #171717;
  overflow-wrap: anywhere;
  word-break: keep-all;
  font-size: clamp(21px, 6vw, 28px);
  font-weight: 920;
  line-height: 1.18;
  letter-spacing: -0.055em;
`;

export const CategoryLine = styled.p`
  margin: 7px 0 0;
  color: #62625d;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.5;
  word-break: keep-all;
`;

export const VideoTitle = styled.p``;

export const Story = styled.p`
  margin: 9px 0 0;
  color: #3f3f3b;
  font-size: 12px;
  font-weight: 680;
  line-height: 1.55;
  word-break: keep-all;
`;

export const TagRow = styled.div``;

export const VideoPreview = styled.button`
  width: 100%;
  min-height: 62px;
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  padding: 7px 10px 7px 7px;
  border: 1px solid #e2e2dd;
  border-radius: 14px;
  background: #fafaf8;
  color: #171717;
  text-align: left;

  img {
    width: 92px;
    aspect-ratio: 16 / 9;
    display: block;
    border-radius: 9px;
    object-fit: cover;
  }

  > span {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  strong,
  small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  strong {
    font-size: 11px;
    font-weight: 900;
  }
  small {
    color: #74746f;
    font-size: 9px;
    font-weight: 650;
  }
`;

export const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 8px;
  margin-top: 14px;

  @media (max-width: 360px) {
    grid-template-columns: 1fr;
  }
`;

export const PrimaryAction = styled.button<{ $active?: boolean }>`
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid ${({ $active }) => ($active ? '#171717' : '#cfcfca')};
  border-radius: 15px;
  background: ${({ $active }) => ($active ? '#171717' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#171717')};
  font-size: 12px;
  font-weight: 900;
`;

export const DetailAction = styled.button`
  min-height: 48px;
  border-radius: 15px;
  background: #171717;
  color: #fff;
  font-size: 12px;
  font-weight: 900;
`;

export const IconAction = styled.button<{ $active?: boolean }>`
  min-height: 48px;
`;

export const SecondaryActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;

  button {
    min-height: 42px;
    padding: 0 4px;
    color: #777772;
    font-size: 10px;
    font-weight: 750;
  }
`;

export const LoadMore = styled.button`
  width: 100%;
  min-height: 54px;
  border: 1px solid #d7d7d2;
  border-radius: 16px;
  background: #fff;
  color: #171717;
  font-size: 11px;
  font-weight: 850;
`;

export const FeedState = styled.div`
  min-height: 42dvh;
  display: grid;
  place-content: center;
  gap: 8px;
  padding: 24px;
  color: #5f5f5a;
  text-align: center;

  strong {
    color: #171717;
    font-size: 17px;
  }
  span {
    font-size: 11px;
    line-height: 1.5;
  }
  button {
    min-height: 44px;
    margin-top: 6px;
    padding: 0 16px;
    border-radius: 999px;
    background: #171717;
    color: #fff;
    font-size: 11px;
    font-weight: 850;
  }
`;

export const Empty = styled.div`
  min-height: 54dvh;
  display: grid;
  place-content: center;
  gap: 7px;
  padding: 24px;
  color: #686863;
  text-align: center;

  strong {
    color: #171717;
    font-size: 18px;
  }
  span {
    font-size: 11px;
    line-height: 1.5;
  }
`;

export const Hero = styled.div<{ $image?: string }>``;
export const HeroScrim = styled.div``;
export const Content = styled.div``;
export const CandidateDock = styled.button``;
