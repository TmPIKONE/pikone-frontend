import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useMyInfo } from '~/hooks/useMyInfo';
import { useRecentRecords } from '~/hooks/useRecentRecords';
import { usePendingDraftCount } from '~/hooks/usePendingDraftCount';
import * as S from './Home.styles';

const DEFAULT_AVATAR = '/default-avatar.png';

const Home = () => {
  const navigate = useNavigate();
  const { data: user } = useMyInfo();
  const { data: recentRecords, isLoading: isRecordsLoading } = useRecentRecords(3);
  const { data: pendingCount } = usePendingDraftCount();

  return (
    <S.Container>
      <S.GreetingSection onClick={() => navigate('/mypage/settings')} style={{ cursor: 'pointer' }}>
        <S.Avatar src={user?.imageUrl || DEFAULT_AVATAR} alt="프로필 이미지" />
        <S.GreetingTextBox>
          <S.Nickname>{user?.nickname ?? '피코'}님</S.Nickname>
          <S.GreetingSub>오늘은 어떤 맛집을 다녀오셨나요?</S.GreetingSub>
        </S.GreetingTextBox>
      </S.GreetingSection>

      {!!pendingCount && pendingCount > 0 && (
        <S.DraftBanner onClick={() => navigate('/draft')}>
          <span>확인 대기 중인 자동 기록이 {pendingCount}개 있어요</span>
          <span>{'>'}</span>
        </S.DraftBanner>
      )}

      <section>
        <S.SectionTitle>최근 기록</S.SectionTitle>

        {isRecordsLoading ? (
          <S.EmptyState>불러오는 중...</S.EmptyState>
        ) : recentRecords && recentRecords.length > 0 ? (
          <S.RecordList>
            {recentRecords.map((record) => (
              <S.RecordCard
                key={record.recordId}
                onClick={() => navigate(`/record/${record.visitDate}?highlight=${record.recordId}`)}
              >
                <S.RecordThumbnail src={record.thumbnailUrl} alt={record.visitDate} />
                <S.RecordDate>{record.visitDate}</S.RecordDate>
                {record.companionName && (
                  <S.RecordCompanion>{record.companionName}</S.RecordCompanion>
                )}
              </S.RecordCard>
            ))}
          </S.RecordList>
        ) : (
          <S.EmptyState>아직 이번 달 기록이 없어요. 첫 기록을 남겨보세요!</S.EmptyState>
        )}
      </section>

      <S.FloatingButton onClick={() => navigate('/record/add')} aria-label="기록 추가하기">
        <Plus size={24} strokeWidth={2.2} />
      </S.FloatingButton>
    </S.Container>
  );
};

export default Home;
