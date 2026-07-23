import { ArrowRight, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecordsByDate } from '~/hooks/useRecordsByDate';
import { DailyRecordCard } from '~/components/DailyRecordCard/DailyRecordCard';
import { RecordPlaceholderIllustration } from '~/components/RecordPlaceholderIllustration/RecordPlaceholderIllustration';
import type { DailyRecordsSectionProps } from './DailyRecordsSection.types';
import * as S from './DailyRecordsSection.styles';

const MAX_VISIBLE_RECORDS = 3;

const formatSelectedDate = (value: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${value}T00:00:00`));

export const DailyRecordsSection = ({ selectedDate }: DailyRecordsSectionProps) => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useRecordsByDate(selectedDate);
  const records = useMemo(() => data?.slice(0, MAX_VISIBLE_RECORDS) ?? [], [data]);
  const selectedDateLabel = formatSelectedDate(selectedDate);

  return (
    <S.Section>
      <S.Header>
        <S.Heading>
          <S.TitleRow>
            <S.Title>기록</S.Title>
            {records.length > 0 && <S.Count>{records.length}</S.Count>}
          </S.TitleRow>
        </S.Heading>

        <S.CalendarButton type="button" onClick={() => navigate('/calendar')}>
          전체보기
          <ChevronRight size={16} strokeWidth={2.2} />
        </S.CalendarButton>
      </S.Header>

      <S.Content>
        {isLoading ? (
          <S.SkeletonList aria-label={`${selectedDateLabel} 기록 불러오는 중`}>
            {[0, 1].map((item) => (
              <S.Skeleton key={item} />
            ))}
          </S.SkeletonList>
        ) : isError ? (
          <S.ErrorBox>
            <div>
              <strong>기록을 불러오지 못했어요</strong>
              <button type="button" onClick={() => void refetch()}>
                다시 불러오기
              </button>
            </div>
          </S.ErrorBox>
        ) : records.length > 0 ? (
          <S.List
            $hasMultiple={records.length > 1}
            aria-label={`${selectedDateLabel} 식사 기록 최대 3개`}
          >
            {records.map((record) => (
              <DailyRecordCard
                key={record.recordId}
                record={record}
                visitDate={selectedDate}
                onClick={() => navigate(`/record/${selectedDate}`)}
              />
            ))}
          </S.List>
        ) : (
          <S.Empty>
            <S.EmptyVisual>
            </S.EmptyVisual>
            <S.EmptyCopy>
              <strong>{selectedDateLabel}에는 기록이 없어요</strong>

            </S.EmptyCopy>
            <S.EmptyAction type="button" onClick={() => navigate('/record/add')}>
              식사 기록 추가
            </S.EmptyAction>
          </S.Empty>
        )}
      </S.Content>

      <S.Meadow>

      </S.Meadow>
    </S.Section>
  );
};
