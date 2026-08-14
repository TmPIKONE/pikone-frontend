// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createRecordViewState,
  rememberRecordViewDate,
  resolveRecordViewDate,
} from './recordViewNavigation';

const STORAGE_KEY = 'pikone.recordViewDate';

describe('record view navigation contract', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('route state, legacy query, session fallback 순서를 유지한다', () => {
    sessionStorage.setItem(STORAGE_KEY, '2026-08-10');

    expect(resolveRecordViewDate(createRecordViewState('2026-08-12'), '2026-08-11')).toBe(
      '2026-08-12',
    );
    expect(resolveRecordViewDate({}, '2026-08-11')).toBe('2026-08-11');
    expect(resolveRecordViewDate({}, null)).toBe('2026-08-10');
  });

  it('유효한 로컬 날짜만 기억한다', () => {
    rememberRecordViewDate('2026-08-12');
    expect(sessionStorage.getItem(STORAGE_KEY)).toBe('2026-08-12');

    rememberRecordViewDate('08/13/2026');
    expect(sessionStorage.getItem(STORAGE_KEY)).toBe('2026-08-12');
  });

  it('브라우저 저장소가 제한되어도 navigation을 중단하지 않는다', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked');
    });

    expect(() => rememberRecordViewDate('2026-08-12')).not.toThrow();
    expect(resolveRecordViewDate({}, null)).toBe('');
  });
});
