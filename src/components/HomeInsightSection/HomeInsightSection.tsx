import { RotateCcw } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '~/features/records/record.queries';
import { parseLocalDate } from '~/utils/date';
import type { HomeInsightSectionProps } from './HomeInsightSection.types';
import * as S from './HomeInsightSection.styles';

const findMostFrequentFood = (foods: Array<string | undefined>) => {
  const counts = foods.reduce<Map<string, number>>((acc, food) => {
    const label = food?.trim();
    if (label) acc.set(label, (acc.get(label) ?? 0) + 1);
    return acc;
  }, new Map());

  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
};

export const HomeInsightSection = ({ selectedDate }: HomeInsightSectionProps) => {
  const navigate = useNavigate();
  const date = parseLocalDate(selectedDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const { data = [], isLoading } = useCalendar(year, month);

  const insights = useMemo(() => {
    const revisitCount = data.filter((record) => record.willRevisit).length;
    const companionCount = data.filter((record) => record.companionName?.trim()).length;

    return {
      total: data.length,
      revisitRate: data.length > 0 ? Math.round((revisitCount / data.length) * 100) : 0,
      companionCount,
      favoriteFood: findMostFrequentFood(data.map((record) => record.foodName)),
    };
  }, [data]);

  return (
    <S.Section>
      <S.Header>
        <S.Title>나의 변화</S.Title>
        <S.Tabs aria-label="월간 리포트 항목">
          <strong>기록</strong>
          <span>재방문</span>
          <span>함께</span>
        </S.Tabs>
      </S.Header>

      <S.Question>{month}월에 남긴 식사는?</S.Question>
      <S.MainMetric>{isLoading ? '--' : insights.total}</S.MainMetric>
      <S.Unit>끼</S.Unit>

      <S.Visual aria-hidden="true">
        <span>🍽️</span>
        <i />
      </S.Visual>

      <S.Favorite>
        가장 자주 남긴 메뉴
        <strong>{isLoading ? '확인 중' : insights.favoriteFood || '아직 기록이 없어요'}</strong>
      </S.Favorite>

      <S.Stats>
        <S.Stat>
          <span>재방문 의사</span>
          <strong>{isLoading ? '-' : `${insights.revisitRate}%`}</strong>
        </S.Stat>
        <S.Stat>
          <span>함께한 식사</span>
          <strong>{isLoading ? '-' : `${insights.companionCount}번`}</strong>
        </S.Stat>
        <S.Stat>
          <span>이번 달 기록</span>
          <strong>{isLoading ? '-' : `${insights.total}끼`}</strong>
        </S.Stat>
      </S.Stats>

      <S.Action type="button" onClick={() => navigate('/calendar')}>
        월간 기록 자세히 보기
      </S.Action>
      <S.RefreshLabel>
        기록이 쌓이면 자동으로 달라져요
        <RotateCcw size={15} strokeWidth={2.3} />
      </S.RefreshLabel>
    </S.Section>
  );
};
