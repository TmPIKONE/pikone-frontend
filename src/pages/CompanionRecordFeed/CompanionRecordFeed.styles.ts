import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  min-height: 100dvh;
  padding-bottom: max(42px, env(safe-area-inset-bottom));
  background: ${theme.colors.white};
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  min-height: calc(72px + env(safe-area-inset-top));
  padding: env(safe-area-inset-top) ${theme.app.pagePadding} 0;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 42px;
  align-items: center;
  gap: 11px;
  border-bottom: 1px solid rgba(233, 235, 239, 0.88);
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
`;

export const BackButton = styled.button`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.black};

  &:active {
    transform: scale(0.96);
  }
`;

export const HeaderTitleBox = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const HeaderEyebrow = styled.span`
  overflow: hidden;
  color: ${theme.colors.gray400};
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HeaderTitle = styled.h1`
  overflow: hidden;
  color: ${theme.colors.black};
  font-size: 17px;
  font-weight: 900;
  letter-spacing: -0.045em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HeaderCount = styled.span`
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  justify-self: end;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 11px;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
`;

export const Feed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  padding: 26px ${theme.app.pagePadding} 0;
`;

export const Post = styled.article`
  scroll-margin-top: calc(88px + env(safe-area-inset-top));
  background: ${theme.colors.white};
`;

export const PostHeader = styled.header`
  min-height: 54px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
`;

export const ProfileBadge = styled.span`
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 14px;
  font-weight: 950;
`;

export const PostHeading = styled.div`
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const ProfileName = styled.strong`
  overflow: hidden;
  color: ${theme.colors.black};
  font-size: 13px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RestaurantName = styled.span`
  overflow: hidden;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CompactDate = styled.time`
  flex: 0 0 auto;
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
  font-size: 10px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
`;

export const ImageFrame = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: ${theme.radius.xl};
  background: ${theme.colors.gray100};
`;

export const PostImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const PostBody = styled.div`
  padding-top: 17px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FoodName = styled.h2`
  color: ${theme.colors.black};
  font-size: 20px;
  font-weight: 950;
  letter-spacing: -0.055em;
  line-height: 1.3;
`;

export const MetaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MetaItem = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.gray500};
  font-size: 11px;
  font-weight: 650;
  line-height: 1.45;

  svg {
    flex: 0 0 auto;
    color: ${theme.colors.gray400};
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const LoadingFeed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 34px;
  padding: 26px ${theme.app.pagePadding};
`;

export const LoadingCard = styled.div`
  width: 100%;
  aspect-ratio: 0.88 / 1;
  border-radius: ${theme.radius.xl};
  background: linear-gradient(
    100deg,
    ${theme.colors.gray100} 22%,
    ${theme.colors.gray50} 38%,
    ${theme.colors.gray100} 54%
  );
  background-size: 220% 100%;
  animation: feed-shimmer 1.25s linear infinite;

  @keyframes feed-shimmer {
    to {
      background-position-x: -220%;
    }
  }
`;

export const EmptyState = styled.div`
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 26px ${theme.app.pagePadding};
  padding: 30px;
  border-radius: ${theme.radius.xl};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray400};
  text-align: center;

  strong {
    margin-top: 5px;
    color: ${theme.colors.black};
    font-size: 14px;
    font-weight: 900;
  }

  span {
    max-width: 250px;
    color: ${theme.colors.gray500};
    font-size: 11px;
    font-weight: 650;
    line-height: 1.6;
  }
`;

export const EmptyIcon = styled.span`
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.white};
  color: ${theme.colors.black};
`;

export const RetryButton = styled.button`
  min-height: 40px;
  margin-top: 5px;
  padding: 0 14px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 11px;
  font-weight: 850;
`;
