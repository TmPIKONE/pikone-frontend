import { useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent, UIEvent } from 'react';
import { X } from 'lucide-react';
import type { PlaceTypeWheelPickerProps } from './PlaceTypeWheelPicker.types';
import * as S from './PlaceTypeWheelPicker.styles';

const ITEM_HEIGHT = 48;

export const PlaceTypeWheelPicker = ({
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

    setSelectedValue(value);
    const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
    const animationFrame = window.requestAnimationFrame(() => {
      wheelRef.current?.scrollTo({ top: selectedIndex * ITEM_HEIGHT });
    });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, options, value]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

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

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setIsOpen(false);
  };

  const handleApply = () => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <>
      <S.Trigger
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`${ariaLabel}: ${selectedLabel}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span>{selectedLabel}</span>
        <S.TriggerIcon size={20} strokeWidth={2.1} $isOpen={isOpen} />
      </S.Trigger>

      <S.Overlay $isOpen={isOpen} onClick={handleOverlayClick} aria-hidden={!isOpen}>
        <S.Sheet $isOpen={isOpen} role="dialog" aria-modal="true" aria-label={title}>
          <S.Handle />
          <S.Header>
            <S.Title>{title}</S.Title>
            <S.CloseButton
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={`${title} 닫기`}
            >
              <X size={19} strokeWidth={2.2} />
            </S.CloseButton>
          </S.Header>

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

          <S.ApplyButton type="button" onClick={handleApply}>
            이 유형으로 선택
          </S.ApplyButton>
        </S.Sheet>
      </S.Overlay>
    </>
  );
};

export default PlaceTypeWheelPicker;
