import { useEffect, useRef, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  MapPin,
  MoreVertical,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  UsersRound,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MAX_RECORDS_PER_DAY } from '~/features/records/record.constants';
import {
  createRecordViewState,
  RECORD_VIEW_PATH,
  rememberRecordViewDate,
  resolveRecordViewDate,
} from '~/features/records/recordViewNavigation';
import { useDeleteRecord, useRecordsByDate } from '~/features/records/record.queries';
import type { RecordDetailResponse } from '~/apis/record/record.types';
import { parseLocalDate } from '~/utils/date';
import { resolveOptimizedImageUrl } from '~/utils/image';
import { buildNaverMapUrl } from '~/features/records/restaurantMap';
import { ConfirmDialog } from '~/components/ConfirmDialog/ConfirmDialog';
import * as S from './RecordView.styles';

interface RecordSlideProps {
  record: RecordDetailResponse;
  index: number;
  total: number;
  fallbackDate: string;
}

interface RecordActionMenuProps {
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: (returnFocusElement: HTMLButtonElement | null) => void;
}

const RecordActionMenu = ({ isDeleting, onEdit, onDelete }: RecordActionMenuProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <S.HeaderActionSlot ref={rootRef}>
      <S.MoreButton
        ref={moreButtonRef}
        type="button"
        aria-label="기록 메뉴 열기"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <MoreVertical size={23} aria-hidden="true" />
      </S.MoreButton>
      {isOpen && (
        <S.ActionMenu role="menu">
          <S.ActionMenuButton
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onEdit();
            }}
          >
            <Pencil size={17} aria-hidden="true" />
            전체 수정
          </S.ActionMenuButton>
          <S.ActionMenuButton
            type="button"
            role="menuitem"
            $danger
            disabled={isDeleting}
            onClick={() => {
              setIsOpen(false);
              onDelete(moreButtonRef.current);
            }}
          >
            <Trash2 size={17} aria-hidden="true" />
            {isDeleting ? '삭제 중' : '삭제'}
          </S.ActionMenuButton>
        </S.ActionMenu>
      )}
    </S.HeaderActionSlot>
  );
};

const RecordSlide = ({ record, index, total, fallbackDate }: RecordSlideProps) => {
  const companionNames = record.companionNames?.length
    ? record.companionNames
    : record.companionName
      ? [record.companionName]
      : [];
  const visitDate = record.visitDate ?? fallbackDate;
  const mapUrl = buildNaverMapUrl(record.restaurantName);

  return (
    <S.RecordSlide>
      <S.Hero>
        <S.RecordImage
          src={resolveOptimizedImageUrl(record.imageUrl)}
          alt={`${record.foodName} 식사 사진`}
          decoding="async"
        />
        <S.HeroShade />
        <S.PositionBadge>
          {index + 1} / {total}
        </S.PositionBadge>
        <S.HeroCopy>
          <S.FoodName>{record.foodName}</S.FoodName>

          {record.willRevisit && (
            <S.RevisitLabel>
              <RotateCcw size={12} aria-hidden="true" />
              재방문
            </S.RevisitLabel>
          )}
        </S.HeroCopy>
      </S.Hero>

      <S.MemoryCard>
        <S.InfoRow>
          <S.InfoIcon>
            <MapPin size={18} strokeWidth={2.1} aria-hidden="true" />
          </S.InfoIcon>
          <S.RestaurantLine>
            <strong>{record.restaurantName}</strong>
            <S.NaverMapLink href={mapUrl} target="_blank" rel="noreferrer">
              지도 보기
            </S.NaverMapLink>
          </S.RestaurantLine>
        </S.InfoRow>

        <S.InfoRow>
          <S.InfoIcon>
            <CalendarDays size={18} strokeWidth={2.1} aria-hidden="true" />
          </S.InfoIcon>
          <S.InfoCopy>
            <strong>{visitDate.replace(/-/g, '.')}</strong>
            <span>{record.isPublic ? '동행자에게 공개 중' : '나만 보는 기록'}</span>
          </S.InfoCopy>
        </S.InfoRow>

        <S.InfoRow>
          <S.InfoIcon>
            <UsersRound size={18} strokeWidth={2.1} aria-hidden="true" />
          </S.InfoIcon>
          <S.InfoCopy>
            <strong>{companionNames.length > 0 ? companionNames.join(' · ') : '혼자'}</strong>
            <span>
              {companionNames.length > 1
                ? `${companionNames.length}명과 함께한 식사`
                : '함께한 사람'}
            </span>
          </S.InfoCopy>
        </S.InfoRow>
      </S.MemoryCard>
    </S.RecordSlide>
  );
};

const RecordView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const legacyDate = new URLSearchParams(location.search).get('date');
  const date = resolveRecordViewDate(location.state, legacyDate);
  const isValidDate =
    /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(parseLocalDate(date).getTime());
  const albumRef = useRef<HTMLDivElement>(null);
  const deleteReturnFocusRef = useRef<HTMLButtonElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const { data: records, isLoading, isError, refetch } = useRecordsByDate(isValidDate ? date : '');
  const recordCount = records?.length ?? 0;
  const displayedIndex = Math.min(activeIndex, Math.max(recordCount - 1, 0));
  const activeRecord = records?.[displayedIndex];
  const isDateFull = recordCount >= MAX_RECORDS_PER_DAY;
  const dateLabel = isValidDate
    ? new Intl.DateTimeFormat('ko-KR', {
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }).format(parseLocalDate(date))
    : '기록 보기';

  const { mutate: deleteRecord, isPending: isDeleting } = useDeleteRecord(
    deleteTargetId ?? activeRecord?.recordId ?? 0,
    {
      onSuccess: () => {
        setDeleteTargetId(null);
        setActiveIndex((current) => Math.max(0, Math.min(current, recordCount - 2)));
        void refetch();
      },
    },
  );

  useEffect(() => {
    if (!isValidDate) return;

    rememberRecordViewDate(date);
    if (location.search) {
      navigate(RECORD_VIEW_PATH, {
        replace: true,
        state: createRecordViewState(date),
      });
    }
  }, [date, isValidDate, location.search, navigate]);

  const handleAlbumScroll = () => {
    const album = albumRef.current;
    if (!album || album.clientWidth === 0) return;
    const nextIndex = Math.round(album.scrollLeft / album.clientWidth);
    setActiveIndex(nextIndex);
  };

  const handleEdit = () => {
    if (!activeRecord) return;
    navigate(`/record/edit/${activeRecord.recordId}?date=${date}`);
  };

  const handleDelete = (returnFocusElement: HTMLButtonElement | null) => {
    if (!activeRecord || isDeleting) return;
    deleteReturnFocusRef.current = returnFocusElement;
    setDeleteTargetId(activeRecord.recordId);
  };

  const confirmDelete = () => {
    if (deleteTargetId == null || isDeleting) return;
    deleteRecord();
  };

  const handleAdd = () => {
    if (!isValidDate || isDateFull) return;
    navigate(`/record/add?date=${date}`);
  };

  return (
    <S.Container>
      <S.HeaderRow>
        <S.BackButton
          type="button"
          aria-label="달력으로 이동"
          onClick={() => navigate('/calendar')}
        >
          <ChevronLeft size={23} />
        </S.BackButton>
        <S.HeaderCopy>
          <S.DateTitle>{dateLabel}</S.DateTitle>
        </S.HeaderCopy>
        {activeRecord ? (
          <RecordActionMenu
            key={activeRecord.recordId}
            isDeleting={isDeleting}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <S.HeaderActionSlot />
        )}
      </S.HeaderRow>

      {!isValidDate ? (
        <S.EmptyState>
          <strong>날짜 정보가 없어요</strong>
          <span>달력에서 기록을 다시 선택해 주세요.</span>
          <S.PrimaryButton type="button" onClick={() => navigate('/calendar')}>
            달력으로 이동
          </S.PrimaryButton>
        </S.EmptyState>
      ) : isLoading ? (
        <S.EmptyState>기록을 불러오고 있어요...</S.EmptyState>
      ) : isError ? (
        <S.EmptyState>
          <span>기록을 불러오지 못했어요.</span>
          <S.PrimaryButton type="button" onClick={() => void refetch()}>
            다시 불러오기
          </S.PrimaryButton>
        </S.EmptyState>
      ) : records && records.length > 0 ? (
        <>
          {recordCount > 1 && (
            <S.Progress aria-label={`${recordCount}개 중 ${displayedIndex + 1}번째 기록`}>
              {records.map((record, index) => (
                <S.ProgressItem key={record.recordId} $active={index === displayedIndex} />
              ))}
            </S.Progress>
          )}
          <S.Album ref={albumRef} onScroll={handleAlbumScroll}>
            {records.map((record, index) => (
              <RecordSlide
                key={record.recordId}
                record={record}
                index={index}
                total={records.length}
                fallbackDate={date}
              />
            ))}
          </S.Album>
        </>
      ) : (
        <S.EmptyState>
          <S.EmptyEmoji>🍽️</S.EmptyEmoji>
          <strong>이 날의 첫 식사를 남겨보세요</strong>
          <span>사진 한 장이면 메뉴와 식당을 자동으로 채워드려요.</span>
        </S.EmptyState>
      )}

      {isValidDate && (
        <S.FloatingAddButton
          type="button"
          disabled={isDateFull}
          aria-label={isDateFull ? '하루 기록 3개를 모두 채웠어요' : '이 날짜에 기록 추가'}
          title={
            isDateFull ? `하루에는 최대 ${MAX_RECORDS_PER_DAY}개까지 기록할 수 있어요.` : undefined
          }
          onClick={handleAdd}
        >
          <Plus size={19} strokeWidth={2.5} aria-hidden="true" />
          <span>{isDateFull ? '기록 완료' : '기록 추가'}</span>
        </S.FloatingAddButton>
      )}

      <ConfirmDialog
        isOpen={deleteTargetId != null}
        title="기록 삭제"
        description="이 기록을 삭제할까요? 삭제하면 되돌릴 수 없어요."
        confirmLabel="삭제"
        pendingLabel="삭제 중..."
        isPending={isDeleting}
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        returnFocusRef={deleteReturnFocusRef}
      />
    </S.Container>
  );
};

export default RecordView;
