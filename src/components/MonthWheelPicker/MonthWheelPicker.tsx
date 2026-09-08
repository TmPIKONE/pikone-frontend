import { useEffect, useMemo, useRef, useState } from 'react';
import type { UIEvent } from 'react';
import { BottomSheet } from '~/components/BottomSheet/BottomSheet';
import type { MonthWheelPickerProps } from './MonthWheelPicker.types';
import * as S from './MonthWheelPicker.styles';

const ITEM_HEIGHT = 44;
const DEFAULT_MIN_YEAR = 2000;

export const MonthWheelPicker = ({
  isOpen,
  year: selectedYear,
  month: selectedMonth,
  onClose,
  onChange,
}: MonthWheelPickerProps) => {
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const firstYear = Math.min(DEFAULT_MIN_YEAR, selectedYear);
    const lastYear = Math.max(currentYear + 1, selectedYear);
    return Array.from({ length: lastYear - firstYear + 1 }, (_, index) => firstYear + index);
  }, [currentYear, selectedYear]);
  const months = useMemo(() => Array.from({ length: 12 }, (_, index) => index + 1), []);
  const [year, setYear] = useState(selectedYear);
  const [month, setMonth] = useState(selectedMonth);
  const yearWheelRef = useRef<HTMLDivElement>(null);
  const monthWheelRef = useRef<HTMLDivElement>(null);
  const yearTimerRef = useRef<number | null>(null);
  const monthTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const frame = window.requestAnimationFrame(() => {
      yearWheelRef.current?.scrollTo({ top: years.indexOf(year) * ITEM_HEIGHT });
      monthWheelRef.current?.scrollTo({ top: (month - 1) * ITEM_HEIGHT });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, month, year, years]);

  useEffect(
    () => () => {
      [yearTimerRef, monthTimerRef].forEach((timerRef) => {
        if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      });
    },
    [],
  );

  const handleScroll = (
    event: UIEvent<HTMLDivElement>,
    values: number[],
    timerRef: typeof yearTimerRef,
    setValue: (value: number) => void,
  ) => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    const wheel = event.currentTarget;
    timerRef.current = window.setTimeout(() => {
      const index = Math.min(
        values.length - 1,
        Math.max(0, Math.round(wheel.scrollTop / ITEM_HEIGHT)),
      );
      const value = values[index];
      if (value === undefined) return;
      wheel.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
      setValue(value);
    }, 90);
  };

  const selectItem = (
    wheel: HTMLDivElement | null,
    index: number,
    value: number,
    setValue: (nextValue: number) => void,
  ) => {
    setValue(value);
    wheel?.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      title="달력 이동"
      ariaLabel="연월 선택"
      closeLabel="연월 선택 닫기"
      actionLabel="날짜이동"
      onClose={onClose}
      onAction={() => {
        onChange({ year, month });
        onClose();
      }}
    >
      <S.Description>연도와 월을 위아래로 스크롤해 고르세요.</S.Description>
      <S.Wheels>
        <S.SelectionHighlight />
        <S.Wheel
          ref={yearWheelRef}
          aria-label="연도 선택"
          onScroll={(event) => handleScroll(event, years, yearTimerRef, setYear)}
        >
          {years.map((value, index) => (
            <S.WheelItem
              key={value}
              type="button"
              $isSelected={value === year}
              onClick={() => selectItem(yearWheelRef.current, index, value, setYear)}
            >
              {value}년
            </S.WheelItem>
          ))}
        </S.Wheel>
        <S.Wheel
          ref={monthWheelRef}
          aria-label="월 선택"
          onScroll={(event) => handleScroll(event, months, monthTimerRef, setMonth)}
        >
          {months.map((value, index) => (
            <S.WheelItem
              key={value}
              type="button"
              $isSelected={value === month}
              onClick={() => selectItem(monthWheelRef.current, index, value, setMonth)}
            >
              {value}월
            </S.WheelItem>
          ))}
        </S.Wheel>
      </S.Wheels>
    </BottomSheet>
  );
};
