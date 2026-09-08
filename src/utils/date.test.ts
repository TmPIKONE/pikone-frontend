import { describe, expect, it } from 'vitest';
import {
  addLocalDays,
  padTwoDigits,
  parseLocalDate,
  toLocalIsoDate,
  toLocalIsoDateParts,
} from './date';

describe('date utilities', () => {
  it('한 자리 숫자를 두 자리로 채운다', () => {
    expect(padTwoDigits(7)).toBe('07');
  });

  it('로컬 날짜를 시간대 이동 없이 파싱한다', () => {
    const date = parseLocalDate('2026-07-31');

    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(6);
    expect(date.getDate()).toBe(31);
  });

  it('Date를 API 날짜 형식으로 변환한다', () => {
    expect(toLocalIsoDate(new Date(2026, 0, 2))).toBe('2026-01-02');
  });

  it('연월일을 API 날짜 형식으로 변환한다', () => {
    expect(toLocalIsoDateParts(2026, 9, 3)).toBe('2026-09-03');
  });

  it('월 경계를 넘어 날짜를 이동한다', () => {
    expect(addLocalDays('2026-07-31', 1)).toBe('2026-08-01');
    expect(addLocalDays('2026-03-01', -1)).toBe('2026-02-28');
  });
});
