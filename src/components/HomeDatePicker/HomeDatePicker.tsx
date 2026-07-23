import { useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent, UIEvent } from 'react';
import { X } from 'lucide-react';
import type { HomeDatePickerProps } from './HomeDatePicker.types';
import * as S from './HomeDatePicker.styles';

const ITEM_HEIGHT = 44;
const MIN_YEAR = 2000;

const parseLocalDate = (value: string) => new Date(`${value}T00:00:00`);

const toLocalIsoDate = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

export const HomeDatePicker = ({
  isOpen,
  selectedDate,
  onClose,
  onDateChange,
}: HomeDatePickerProps) => {
  const selected = useMemo(() => parseLocalDate(selectedDate), [selectedDate]);
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: currentYear - MIN_YEAR + 2 }, (_, index) => MIN_YEAR + index),
    [currentYear],
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, index) => index + 1), []);

  const [year, setYear] = useState(selected.getFullYear());
  const [month, setMonth] = useState(selected.getMonth() + 1);
  const [day, setDay] = useState(selected.getDate());

  const yearWheelRef = useRef<HTMLDivElement>(null);
  const monthWheelRef = useRef<HTMLDivElement>(null);
  const dayWheelRef = useRef<HTMLDivElement>(null);
  const yearTimerRef = useRef<number | null>(null);
  const monthTimerRef = useRef<number | null>(null);
  const dayTimerRef = useRef<number | null>(null);

  const days = useMemo(
    () => Array.from({ length: getDaysInMonth(year, month) }, (_, index) => index + 1),
    [year, month],
  );

  useEffect(() => {
    if (!isOpen) return;

    const nextSelected = parseLocalDate(selectedDate);
    const nextYear = nextSelected.getFullYear();
    const nextMonth = nextSelected.getMonth() + 1;
    const nextDay = nextSelected.getDate();

    setYear(nextYear);
    setMonth(nextMonth);
    setDay(nextDay);

    const animationFrame = window.requestAnimationFrame(() => {
      yearWheelRef.current?.scrollTo({
        top: Math.max(0, years.indexOf(nextYear)) * ITEM_HEIGHT,
      });
      monthWheelRef.current?.scrollTo({ top: (nextMonth - 1) * ITEM_HEIGHT });
      dayWheelRef.current?.scrollTo({ top: (nextDay - 1) * ITEM_HEIGHT });
    });

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, selectedDate, years]);

  useEffect(() => {
    const lastDay = getDaysInMonth(year, month);

    if (day > lastDay) {
      setDay(lastDay);
      dayWheelRef.current?.scrollTo({ top: (lastDay - 1) * ITEM_HEIGHT });
    }
  }, [day, month, year]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(
    () => () => {
      [yearTimerRef, monthTimerRef, dayTimerRef].forEach((timerRef) => {
        if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      });
    },
    [],
  );

  const handleWheelScroll = (
    event: UIEvent<HTMLDivElement>,
    values: number[],
    timerRef: typeof yearTimerRef,
    onValueChange: (value: number) => void,
  ) => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);

    const wheel = event.currentTarget;
    timerRef.current = window.setTimeout(() => {
      const index = Math.min(
        values.length - 1,
        Math.max(0, Math.round(wheel.scrollTop / ITEM_HEIGHT)),
      );
      const nextValue = values[index];

      if (nextValue === undefined) return;

      wheel.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
      onValueChange(nextValue);
    }, 90);
  };

  const selectWheelItem = (
    wheel: HTMLDivElement | null,
    index: number,
    value: number,
    onValueChange: (nextValue: number) => void,
  ) => {
    onValueChange(value);
    wheel?.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
  };

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleApply = () => {
    onDateChange(toLocalIsoDate(year, month, day));
    onClose();
  };

  return (
    <S.Overlay $isOpen={isOpen} onClick={handleOverlayClick} aria-hidden={!isOpen}>
      <S.Sheet
        $isOpen={isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="기록 날짜 선택"
      >
        <S.Handle />
        <S.Header>
          <S.Title>날짜 선택</S.Title>
          <S.CloseButton type="button" onClick={onClose} aria-label="날짜 선택 닫기">
            <X size={19} strokeWidth={2.2} />
          </S.CloseButton>
        </S.Header>

        <S.Wheels>
          <S.SelectionHighlight />

          <S.Wheel
            ref={yearWheelRef}
            onScroll={(event) =>
              handleWheelScroll(event, years, yearTimerRef, setYear)
            }
            aria-label="연도 선택"
          >
            {years.map((value, index) => (
              <S.WheelItem
                key={value}
                type="button"
                $isSelected={value === year}
                onClick={() =>
                  selectWheelItem(yearWheelRef.current, index, value, setYear)
                }
              >
                {value}년
              </S.WheelItem>
            ))}
          </S.Wheel>

          <S.Wheel
            ref={monthWheelRef}
            onScroll={(event) =>
              handleWheelScroll(event, months, monthTimerRef, setMonth)
            }
            aria-label="월 선택"
          >
            {months.map((value, index) => (
              <S.WheelItem
                key={value}
                type="button"
                $isSelected={value === month}
                onClick={() =>
                  selectWheelItem(monthWheelRef.current, index, value, setMonth)
                }
              >
                {value}월
              </S.WheelItem>
            ))}
          </S.Wheel>

          <S.Wheel
            ref={dayWheelRef}
            onScroll={(event) => handleWheelScroll(event, days, dayTimerRef, setDay)}
            aria-label="일 선택"
          >
            {days.map((value, index) => (
              <S.WheelItem
                key={value}
                type="button"
                $isSelected={value === day}
                onClick={() =>
                  selectWheelItem(dayWheelRef.current, index, value, setDay)
                }
              >
                {value}일
              </S.WheelItem>
            ))}
          </S.Wheel>
        </S.Wheels>

        <S.ApplyButton type="button" onClick={handleApply}>
          이 날짜로 이동
        </S.ApplyButton>
      </S.Sheet>
    </S.Overlay>
  );
};
