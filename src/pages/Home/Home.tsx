import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DailyRecordsSection } from '~/components/DailyRecordsSection/DailyRecordsSection';
import { HomeCompanionStrip } from '~/components/HomeCompanionStrip/HomeCompanionStrip';
import { HomeDateNavigator } from '~/components/HomeDateNavigator/HomeDateNavigator';
import { toLocalIsoDate } from '~/utils/date';
import * as S from './Home.styles';

const Home = () => {
  const navigate = useNavigate();
  const today = toLocalIsoDate(new Date());

  return (
    <S.Container>
      <HomeDateNavigator />
      <HomeCompanionStrip />

      <S.HighlightCard type="button" onClick={() => navigate('/record/add?date=' + today)}>
        <S.HighlightCopy>
          <strong>오늘의 한 끼</strong>
          <span>사진 한 장으로 가볍게 남겨보세요</span>
        </S.HighlightCopy>
        <S.HighlightPlus aria-hidden="true">+</S.HighlightPlus>
      </S.HighlightCard>

      <S.HistoryCard type="button" onClick={() => navigate('/calendar')}>
        <span>지난 기록 모아보기</span>
        <ChevronRight size={24} strokeWidth={2.1} aria-hidden="true" />
      </S.HistoryCard>

      <DailyRecordsSection selectedDate={today} />
    </S.Container>
  );
};

export default Home;
