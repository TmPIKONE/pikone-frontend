import { useState } from 'react';
import { AiRecommendationBanner } from '~/components/AiRecommendationBanner/AiRecommendationBanner';
import { DailyRecordsSection } from '~/components/DailyRecordsSection/DailyRecordsSection';
import { HomeDateNavigator } from '~/components/HomeDateNavigator/HomeDateNavigator';
import { HomeInsightSection } from '~/components/HomeInsightSection/HomeInsightSection';
import { toLocalIsoDate } from '~/utils/date';
import * as S from './Home.styles';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(() => toLocalIsoDate(new Date()));

  return (
    <S.Container>
      <HomeDateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <DailyRecordsSection selectedDate={selectedDate} />
      <HomeInsightSection selectedDate={selectedDate} />
      <AiRecommendationBanner />
    </S.Container>
  );
};

export default Home;
