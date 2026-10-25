import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Page = styled.div`
  min-height: 100dvh;
  background: ${theme.colors.white};
  color: ${theme.colors.black};
`;
export const State = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px;
  font-weight: 800;
`;
export const Hero = styled.header<{ $image?: string }>`
  position: relative;
  height: ${({ $image }) => ($image ? 'min(58dvh, 540px)' : '250px')};
  min-height: ${({ $image }) => ($image ? '390px' : '220px')};
  background: ${({ $image }) => ($image ? `url("${$image.replace(/"/g, '%22')}") center / cover no-repeat,` : '')}
    radial-gradient(circle at 30% 20%, #77705e 0%, #222 65%);
`;
export const Scrim = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.28), transparent 40%, rgba(0, 0, 0, 0.78));
`;
export const BackButton = styled.button`
  position: absolute;
  top: 18px;
  left: 18px;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.38);
  color: white;
  backdrop-filter: blur(8px);
`;
export const HeroCopy = styled.div`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 24px;
  color: white;
  h1 {
    margin: 10px 0 5px;
    font-size: clamp(30px, 9vw, 40px);
    letter-spacing: -0.06em;
  }
  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.74);
    font-size: 13px;
    font-weight: 700;
  }
`;
export const Creator = styled.span`
  display: inline-flex;
  padding: 7px 10px;
  border-radius: 999px;
  background: white;
  color: #111;
  font-size: 11px;
  font-weight: 900;
`;
export const Body = styled.main`
  padding: 24px 20px 44px;
`;
export const Story = styled.p`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.5;
  letter-spacing: -0.035em;
`;
export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  color: ${theme.colors.gray600};
  font-size: 12px;
  font-weight: 800;
`;
export const PrimaryRow = styled.div`
  display: grid;
  margin-top: 22px;
`;
export const PrimaryButton = styled.button`
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 16px;
  background: #111;
  color: white;
  font-weight: 900;
`;
export const SaveButton = styled.button`
  display: grid;
  place-items: center;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 16px;
  background: white;
`;
export const Section = styled.section`
  margin-top: 34px;
`;
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  strong {
    font-size: 17px;
  }
  button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 800;
    color: ${theme.colors.gray600};
  }
`;
export const VideoFrame = styled.iframe`
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  border-radius: 18px;
  background: #111;
`;
export const LocationCard = styled.div`
  display: flex;
  gap: 10px;
  padding: 15px;
  border-radius: 16px;
  background: ${theme.colors.gray50};
  div {
    min-width: 0;
    display: grid;
    gap: 5px;
  }
  strong {
    font-size: 13px;
    line-height: 1.4;
  }
  span {
    color: ${theme.colors.gray600};
    font-size: 11px;
  }
`;
export const MapButton = styled.button`
  width: 100%;
  min-height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 8px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 14px;
  font-size: 13px;
  font-weight: 850;
`;

export const MenuList = styled.div`
  display: grid;
  overflow: hidden;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 16px;
  background: white;
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 52px;
  padding: 13px 15px;

  & + & {
    border-top: 1px solid ${theme.colors.gray100};
  }

  span {
    min-width: 0;
    font-size: 14px;
    font-weight: 750;
    line-height: 1.35;
  }

  strong {
    flex: 0 0 auto;
    font-size: 13px;
    font-weight: 900;
  }
`;

export const CommentReactionCard = styled.div`
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 18px;
  background: ${theme.colors.gray50};
`;

export const CommentReactionSummary = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 720;
  line-height: 1.65;
  letter-spacing: -0.02em;
`;

export const CommentReactionMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  color: ${theme.colors.gray600};
  font-size: 11px;
  font-weight: 700;

  span + span::before {
    content: '·';
    margin-right: 10px;
  }
`;

export const CommentReactionNotice = styled.p`
  margin: 0;
  color: ${theme.colors.gray600};
  font-size: 11px;
  line-height: 1.45;
`;

export const CommentReactionState = styled.p`
  margin: 0;
  color: ${theme.colors.gray600};
  font-size: 13px;
  font-weight: 700;
  line-height: 1.55;
`;
