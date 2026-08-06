import { useEffect, useMemo, useRef, useState } from 'react';
import type { UIEvent } from 'react';
import { BottomSheet } from '~/components/BottomSheet/BottomSheet';
import { parseLocalDate, toLocalIsoDateParts } from '~/utils/date';
import type { HomeDatePickerProps } from './HomeDatePicker.types';
import * as S from './HomeDatePicker.styles';

const ITEM_HEIGHT = 44;
const MIN_YEAR = 2000;

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

export const HomeDatePicker = ({
  isOpen,
  selectedDate,
  title = '날짜 선택',
  ariaLabel = '기록 날짜 선택',
  actionLabel = '이 날짜로 이동',
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

    const animationFrame = window.requestAnimationFrame(() => {
      yearWheelRef.current?.scrollTo({
        top: Math.max(0, years.indexOf(year)) * ITEM_HEIGHT,
      });
      monthWheelRef.current?.scrollTo({ top: (month - 1) * ITEM_HEIGHT });
      dayWheelRef.current?.scrollTo({ top: (day - 1) * ITEM_HEIGHT });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [day, isOpen, month, year, years]);

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

  const handleApply = () => {
    const safeDay = Math.min(day, getDaysInMonth(year, month));
    onDateChange(toLocalIsoDateParts(year, month, safeDay));
    onClose();
  };

  const handleYearChange = (nextYear: number) => {
    setYear(nextYear);
    setDay((currentDay) => Math.min(currentDay, getDaysInMonth(nextYear, month)));
  };

  const handleMonthChange = (nextMonth: number) => {
    setMonth(nextMonth);
    setDay((currentDay) => Math.min(currentDay, getDaysInMonth(year, nextMonth)));
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      title={title}
      ariaLabel={ariaLabel}
      closeLabel="날짜 선택 닫기"
      onClose={onClose}
      actionLabel={actionLabel}
      onAction={handleApply}
    >
      <S.Wheels>
        <S.SelectionHighlight />

        <S.Wheel
          ref={yearWheelRef}
          onScroll={(event) => handleWheelScroll(event, years, yearTimerRef, handleYearChange)}
          aria-label="연도 선택"
        >
          {years.map((value, index) => (
            <S.WheelItem
              key={value}
              type="button"
              $isSelected={value === year}
              onClick={() => selectWheelItem(yearWheelRef.current, index, value, handleYearChange)}
            >
              {value}년
            </S.WheelItem>
          ))}
        </S.Wheel>

        <S.Wheel
          ref={monthWheelRef}
          onScroll={(event) => handleWheelScroll(event, months, monthTimerRef, handleMonthChange)}
          aria-label="월 선택"
        >
          {months.map((value, index) => (
            <S.WheelItem
              key={value}
              type="button"
              $isSelected={value === month}
              onClick={() =>
                selectWheelItem(monthWheelRef.current, index, value, handleMonthChange)
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
              onClick={() => selectWheelItem(dayWheelRef.current, index, value, setDay)}
            >
              {value}일
            </S.WheelItem>
          ))}
        </S.Wheel>
      </S.Wheels>
    </BottomSheet>
  );
};
