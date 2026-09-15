import { Plus, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCompanions } from '~/features/companions/companion.queries';
import { useMyInfo } from '~/features/user/user.queries';
import { resolveImageUrl } from '~/utils/image';
import * as S from './HomeCompanionStrip.styles';

export const HomeCompanionStrip = () => {
  const navigate = useNavigate();
  const { data: user } = useMyInfo();
  const { data: companions = [] } = useCompanions();
  const profileImage = resolveImageUrl(user?.imageUrl);

  return (
    <S.Section aria-label="동행자 바로가기">
      <S.PersonButton type="button" onClick={() => navigate('/mypage/settings')}>
        <S.Avatar>
          {profileImage ? (
            <S.ProfileImage src={profileImage} alt="" />
          ) : (
            <UserRound size={31} strokeWidth={1.8} aria-hidden="true" />
          )}
        </S.Avatar>
        <S.Label>{user?.nickname || '나'}</S.Label>
      </S.PersonButton>

      {companions.map((companion) => (
        <S.PersonButton
          key={companion.companionId}
          type="button"
          onClick={() =>
            navigate(
              companion.isAppUser
                ? `/companion/${companion.companionId}/records`
                : '/companion',
            )
          }
        >
          <S.Avatar>
            <UserRound size={31} strokeWidth={1.8} aria-hidden="true" />
          </S.Avatar>
          <S.Label>{companion.displayName}</S.Label>
        </S.PersonButton>
      ))}

      <S.PersonButton type="button" onClick={() => navigate('/companion/add')}>
        <S.Avatar $add>
          <Plus size={34} strokeWidth={1.65} aria-hidden="true" />
        </S.Avatar>
        <S.Label>동행자 연결</S.Label>
      </S.PersonButton>
    </S.Section>
  );
};
