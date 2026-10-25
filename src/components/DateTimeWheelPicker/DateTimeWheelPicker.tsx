import { useEffect, useMemo, useRef, useState } from 'react';
import type { UIEvent } from 'react';
import { BottomSheet } from '~/components/BottomSheet/BottomSheet';
import { padTwoDigits } from '~/utils/date';
import type { DateTimeWheelPickerProps } from './DateTimeWheelPicker.types';
import * as S from './DateTimeWheelPicker.styles';

const ITEM_HEIGHT = 44;
const MIN_YEAR = new Date().getFullYear();
const FUTURE_YEAR_COUNT = 4;

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

const snapToTenMinutes = (date: Date) => {
  const snapped = new Date(date);
  snapped.setSeconds(0, 0);
  snapped.setMinutes(Math.round(snapped.getMinutes() / 10) * 10);
  return snapped;
};

const parseValue = (value: string) => {
  if (value) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return snapToTenMinutes(parsed);
  }

  const fallback = new Date();
  fallback.setMinutes(0, 0, 0);
  fallback.setHours(fallback.getHours() + 1);
  return snapToTenMinutes(fallback);
};

const DateTimeWheelPickerView = ({
  isOpen,
  value,
  title = '날짜 · 시간 선택',
  ariaLabel = '약속 날짜와 시간 선택',
  actionLabel = '이 시간으로 선택',
  onClose,
  onChange,
  onClear,
}: DateTimeWheelPickerProps) => {
  const initial = useMemo(() => parseValue(value), [value]);
  const years = useMemo(
    () => Array.from({ length: FUTURE_YEAR_COUNT }, (_, index) => MIN_YEAR + index),
    [],
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, index) => index + 1), []);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, index) => index), []);
  const minutes = useMemo(() => [0, 10, 20, 30, 40, 50], []);

  const [year, setYear] = useState(initial.getFullYear());
  const [month, setMonth] = useState(initial.getMonth() + 1);
  const [day, setDay] = useState(initial.getDate());
  const [hour, setHour] = useState(initial.getHours());
  const [minute, setMinute] = useState(initial.getMinutes());

  const yearWheelRef = useRef<HTMLDivElement>(null);
  const monthWheelRef = useRef<HTMLDivElement>(null);
  const dayWheelRef = useRef<HTMLDivElement>(null);
  const hourWheelRef = useRef<HTMLDivElement>(null);
  const minuteWheelRef = useRef<HTMLDivElement>(null);
  const timerRefs = useRef<Record<string, number | null>>({});

  const days = useMemo(
    () => Array.from({ length: getDaysInMonth(year, month) }, (_, index) => index + 1),
    [year, month],
  );

  useEffect(() => {
    if (!isOpen) return;

    const frame = window.requestAnimationFrame(() => {
      yearWheelRef.current?.scrollTo({ top: Math.max(0, years.indexOf(year)) * ITEM_HEIGHT });
      monthWheelRef.current?.scrollTo({ top: (month - 1) * ITEM_HEIGHT });
      dayWheelRef.current?.scrollTo({ top: (day - 1) * ITEM_HEIGHT });
      hourWheelRef.current?.scrollTo({ top: hour * ITEM_HEIGHT });
      minuteWheelRef.current?.scrollTo({ top: Math.max(0, minutes.indexOf(minute)) * ITEM_HEIGHT });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [day, hour, isOpen, minute, minutes, month, year, years]);

  useEffect(
    () => () => {
      Object.values(timerRefs.current).forEach((timer) => {
        if (timer !== null) window.clearTimeout(timer);
      });
    },
    [],
  );

  const handleWheelScroll = (
    key: string,
    event: UIEvent<HTMLDivElement>,
    values: number[],
    onValueChange: (value: number) => void,
  ) => {
    const currentTimer = timerRefs.current[key];
    if (currentTimer != null) window.clearTimeout(currentTimer);

    const wheel = event.currentTarget;
    timerRefs.current[key] = window.setTimeout(() => {
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
    valueToSet: number,
    onValueChange: (value: number) => void,
  ) => {
    onValueChange(valueToSet);
    wheel?.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
  };

  const handleYearChange = (nextYear: number) => {
    setYear(nextYear);
    setDay((current) => Math.min(current, getDaysInMonth(nextYear, month)));
  };

  const handleMonthChange = (nextMonth: number) => {
    setMonth(nextMonth);
    setDay((current) => Math.min(current, getDaysInMonth(year, nextMonth)));
  };

  const handleApply = () => {
    const safeDay = Math.min(day, getDaysInMonth(year, month));
    onChange(
      `${year}-${padTwoDigits(month)}-${padTwoDigits(safeDay)}T${padTwoDigits(hour)}:${padTwoDigits(minute)}`,
    );
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      title={title}
      ariaLabel={ariaLabel}
      closeLabel="날짜와 시간 선택 닫기"
      actionLabel={actionLabel}
      onAction={handleApply}
      onClose={onClose}
      blurBackdrop
    >
      <S.Section>
        <S.SectionLabel>날짜</S.SectionLabel>
        <S.Wheels $columns={3}>
          <S.SelectionHighlight />
          <S.Wheel
            ref={yearWheelRef}
            onScroll={(event) => handleWheelScroll('year', event, years, handleYearChange)}
            aria-label="연도 선택"
          >
            {years.map((item, index) => (
              <S.WheelItem
                key={item}
                type="button"
                $isSelected={item === year}
                onClick={() => selectWheelItem(yearWheelRef.current, index, item, handleYearChange)}
              >
                {item}년
              </S.WheelItem>
            ))}
          </S.Wheel>
          <S.Wheel
            ref={monthWheelRef}
            onScroll={(event) => handleWheelScroll('month', event, months, handleMonthChange)}
            aria-label="월 선택"
          >
            {months.map((item, index) => (
              <S.WheelItem
                key={item}
                type="button"
                $isSelected={item === month}
                onClick={() =>
                  selectWheelItem(monthWheelRef.current, index, item, handleMonthChange)
                }
              >
                {item}월
              </S.WheelItem>
            ))}
          </S.Wheel>
          <S.Wheel
            ref={dayWheelRef}
            onScroll={(event) => handleWheelScroll('day', event, days, setDay)}
            aria-label="일 선택"
          >
            {days.map((item, index) => (
              <S.WheelItem
                key={item}
                type="button"
                $isSelected={item === day}
                onClick={() => selectWheelItem(dayWheelRef.current, index, item, setDay)}
              >
                {item}일
              </S.WheelItem>
            ))}
          </S.Wheel>
        </S.Wheels>
      </S.Section>

      <S.Section>
        <S.SectionLabel>시간</S.SectionLabel>
        <S.Wheels $columns={2}>
          <S.SelectionHighlight />
          <S.Wheel
            ref={hourWheelRef}
            onScroll={(event) => handleWheelScroll('hour', event, hours, setHour)}
            aria-label="시 선택"
          >
            {hours.map((item, index) => (
              <S.WheelItem
                key={item}
                type="button"
                $isSelected={item === hour}
                onClick={() => selectWheelItem(hourWheelRef.current, index, item, setHour)}
              >
                {padTwoDigits(item)}시
              </S.WheelItem>
            ))}
          </S.Wheel>
          <S.Wheel
            ref={minuteWheelRef}
            onScroll={(event) => handleWheelScroll('minute', event, minutes, setMinute)}
            aria-label="분 선택"
          >
            {minutes.map((item, index) => (
              <S.WheelItem
                key={item}
                type="button"
                $isSelected={item === minute}
                onClick={() => selectWheelItem(minuteWheelRef.current, index, item, setMinute)}
              >
                {padTwoDigits(item)}분
              </S.WheelItem>
            ))}
          </S.Wheel>
        </S.Wheels>
      </S.Section>

      {onClear && value && (
        <S.ClearButton
          type="button"
          onClick={() => {
            onClear();
            onClose();
          }}
        >
          날짜 · 시간 선택 안 함
        </S.ClearButton>
      )}
    </BottomSheet>
  );
};

// Reopening or receiving a new committed value starts a fresh temporary wheel selection.
export const DateTimeWheelPicker = (props: DateTimeWheelPickerProps) => (
  <DateTimeWheelPickerView key={`${props.isOpen}:${props.value}`} {...props} />
);
