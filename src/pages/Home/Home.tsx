import { useState } from 'react';
import { AiRecommendationBanner } from '~/components/AiRecommendationBanner/AiRecommendationBanner';
import { DailyRecordsSection } from '~/components/DailyRecordsSection/DailyRecordsSection';
import { HomeDateNavigator } from '~/components/HomeDateNavigator/HomeDateNavigator';
import { HomeQuickMenu } from '~/components/HomeQuickMenu/HomeQuickMenu';
import * as S from './Home.styles';

const toLocalIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(() => toLocalIsoDate(new Date()));

  return (
    <S.Container>
      <HomeDateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <DailyRecordsSection selectedDate={selectedDate} />
      <AiRecommendationBanner />
      <HomeQuickMenu />
    </S.Container>
  );
};

export default Home;
