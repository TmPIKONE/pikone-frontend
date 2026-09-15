import { DailyRecordsSection } from '~/components/DailyRecordsSection/DailyRecordsSection';
import { HomeDateNavigator } from '~/components/HomeDateNavigator/HomeDateNavigator';
import { toLocalIsoDate } from '~/utils/date';
import * as S from './Home.styles';

const Home = () => {
  const today = toLocalIsoDate(new Date());

  return (
    <S.Container>
      <HomeDateNavigator />
      <DailyRecordsSection selectedDate={today} />
    </S.Container>
  );
};

export default Home;
