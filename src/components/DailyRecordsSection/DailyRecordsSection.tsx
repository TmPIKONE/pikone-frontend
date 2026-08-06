import { CheckCircle2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DailyRecordCard } from '~/components/DailyRecordCard/DailyRecordCard';
import { useRecordsByDate } from '~/features/records/record.queries';
import {
  createRecordViewState,
  RECORD_VIEW_PATH,
} from '~/features/records/recordViewNavigation';
import type { DailyRecordsSectionProps } from './DailyRecordsSection.types';
import * as S from './DailyRecordsSection.styles';

const MEAL_SLOTS = [
  { label: '아침', emoji: '☀️' },
  { label: '점심', emoji: '🌤️' },
  { label: '저녁', emoji: '🌙' },
  { label: '간식', emoji: '🍰' },
] as const;

export const DailyRecordsSection = ({ selectedDate }: DailyRecordsSectionProps) => {
  const navigate = useNavigate();
  const { data = [], isLoading, isError, refetch } = useRecordsByDate(selectedDate);
  const visibleRecords = data.slice(0, MEAL_SLOTS.length);

  return (
    <S.Section>
      <S.SectionHeader>
        <div>
          <S.Eyebrow>오늘의 식사</S.Eyebrow>
          <S.Title>{isLoading ? '기록을 불러오는 중' : `${data.length}끼 남겼어요`}</S.Title>
        </div>
        <S.DateButton type="button" onClick={() => navigate('/calendar')}>
          식단 앨범
        </S.DateButton>
      </S.SectionHeader>

      {isError ? (
        <S.ErrorBox>
          <span>기록을 불러오지 못했어요.</span>
          <button type="button" onClick={() => void refetch()}>
            다시 불러오기
          </button>
        </S.ErrorBox>
      ) : (
        <S.Grid aria-label="하루 식사 기록">
          {MEAL_SLOTS.map((slot, index) => {
            const record = visibleRecords[index];

            return record ? (
              <DailyRecordCard
                key={record.recordId}
                record={record}
                slotLabel={slot.label}
                slotEmoji={slot.emoji}
                onClick={() =>
                  navigate(RECORD_VIEW_PATH, { state: createRecordViewState(selectedDate) })
                }
              />
            ) : (
              <S.EmptySlot
                key={slot.label}
                type="button"
                onClick={() => navigate(`/record/add?date=${selectedDate}`)}
                aria-label={`${slot.label} 식사 기록 추가`}
              >
                <S.EmptyTop>
                  <span>{slot.emoji}</span>
                  <Plus size={38} strokeWidth={2} />
                </S.EmptyTop>
                <S.EmptyCopy>
                  <strong>{slot.label}</strong>
                  <span>
                    <CheckCircle2 size={19} strokeWidth={2.4} />
                    기록해 주세요
                  </span>
                </S.EmptyCopy>
              </S.EmptySlot>
            );
          })}
        </S.Grid>
      )}

      <S.AlbumButton type="button" onClick={() => navigate('/calendar')}>
        <span>🍎 기록 모아보기</span>
        <i />
        <span>🖼️ 식단 앨범</span>
      </S.AlbumButton>
    </S.Section>
  );
};
