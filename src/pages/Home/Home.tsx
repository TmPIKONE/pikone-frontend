import { useState } from 'react';
import { DailyRecordsSection } from '~/components/DailyRecordsSection/DailyRecordsSection';
import { HomeDateNavigator } from '~/components/HomeDateNavigator/HomeDateNavigator';
import { toLocalIsoDate } from '~/utils/date';
import * as S from './Home.styles';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(() => toLocalIsoDate(new Date()));

  return (
    <S.Container>
      <HomeDateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <DailyRecordsSection selectedDate={selectedDate} />
    </S.Container>
  );
};

export default Home;
