import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { UIEvent } from 'react';
import { BottomSheet } from '~/components/BottomSheet/BottomSheet';
import type { PlaceTypeWheelPickerProps } from './PlaceTypeWheelPicker.types';
import * as S from './PlaceTypeWheelPicker.styles';

const ITEM_HEIGHT = 48;

export const PlaceTypeWheelPicker = ({
  id,
  value,
  options,
  onChange,
  title = '장소 유형 선택',
  ariaLabel = '장소 유형 선택',
}: PlaceTypeWheelPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const wheelRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const selectedLabel = useMemo(
    () => options.find((option) => option.value === value)?.label ?? options[0]?.label ?? '',
    [options, value],
  );

  useEffect(() => {
    if (!isOpen) return;

    const selectedIndex = Math.max(
      0,
      options.findIndex((option) => option.value === value),
    );
    const animationFrame = window.requestAnimationFrame(() => {
      wheelRef.current?.scrollTo({ top: selectedIndex * ITEM_HEIGHT });
    });
    return () => window.cancelAnimationFrame(animationFrame);
  }, [isOpen, options, value]);

  useEffect(
    () => () => {
      if (scrollTimerRef.current !== null) window.clearTimeout(scrollTimerRef.current);
    },
    [],
  );

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (scrollTimerRef.current !== null) window.clearTimeout(scrollTimerRef.current);
    const wheel = event.currentTarget;
    scrollTimerRef.current = window.setTimeout(() => {
      const index = Math.min(
        options.length - 1,
        Math.max(0, Math.round(wheel.scrollTop / ITEM_HEIGHT)),
      );
      const nextOption = options[index];
      if (!nextOption) return;
      wheel.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
      setSelectedValue(nextOption.value);
    }, 90);
  };

  const handleApply = () => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleOpen = () => {
    setSelectedValue(value);
    setIsOpen(true);
  };

  return (
    <>
      <S.Trigger
        id={id}
        type="button"
        onClick={handleOpen}
        aria-label={`${ariaLabel}: ${selectedLabel}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span>{selectedLabel}</span>
        <S.TriggerIcon size={20} strokeWidth={2.1} $isOpen={isOpen} />
      </S.Trigger>

      <BottomSheet
        isOpen={isOpen}
        title={title}
        ariaLabel={title}
        closeLabel={`${title} 닫기`}
        onClose={handleClose}
        actionLabel="이 유형으로 선택"
        actionDisabled={options.length === 0}
        onAction={handleApply}
        zIndex={1100}
      >
        <S.WheelFrame>
          <S.SelectionHighlight />
          <S.Wheel ref={wheelRef} onScroll={handleScroll} aria-label={ariaLabel}>
            {options.map((option, index) => (
              <S.WheelItem
                key={option.value}
                type="button"
                $isSelected={option.value === selectedValue}
                onClick={() => {
                  setSelectedValue(option.value);
                  wheelRef.current?.scrollTo({
                    top: index * ITEM_HEIGHT,
                    behavior: 'smooth',
                  });
                }}
              >
                {option.label}
              </S.WheelItem>
            ))}
          </S.Wheel>
        </S.WheelFrame>
      </BottomSheet>
    </>
  );
};

export default PlaceTypeWheelPicker;
