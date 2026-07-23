import type { QuickMenuIllustrationProps } from './QuickMenuIllustration.types';
import * as S from './QuickMenuIllustration.styles';

export const QuickMenuIllustration = ({ type }: QuickMenuIllustrationProps) => {
  if (type === 'record') {
    return (
      <S.Illustration viewBox="0 0 120 92" aria-hidden="true">
        <rect x="18" y="25" width="76" height="53" rx="16" fill="#FFFFFF" />
        <rect x="35" y="18" width="25" height="13" rx="6" fill="#244A7C" />
        <circle cx="57" cy="51" r="17" fill="#FFD95C" />
        <circle cx="57" cy="51" r="10" fill="#FF9C82" />
        <circle cx="84" cy="37" r="4" fill="#76D7C4" />
        <path d="M91 16l4 7 8 2-6 5v8l-7-4-7 4 2-8-6-5 8-1 4-8Z" fill="#A696FF" />
      </S.Illustration>
    );
  }

  if (type === 'ai') {
    return (
      <S.Illustration viewBox="0 0 120 92" aria-hidden="true">
        <path d="M60 13l8 18 19 8-19 8-8 20-8-20-19-8 19-8 8-18Z" fill="#FFFFFF" />
        <path d="M93 18l4 9 10 4-10 4-4 10-4-10-10-4 10-4 4-9Z" fill="#FFD95C" />
        <circle cx="31" cy="64" r="11" fill="#FF9C82" />
      </S.Illustration>
    );
  }

  if (type === 'calendar') {
    return (
      <S.Illustration viewBox="0 0 120 92" aria-hidden="true">
        <rect x="20" y="20" width="78" height="62" rx="16" fill="#FFFFFF" />
        <path d="M20 39h78" stroke="#6EA8FF" strokeWidth="5" />
        <path d="M38 13v17M80 13v17" stroke="#244A7C" strokeWidth="5" strokeLinecap="round" />
        <circle cx="40" cy="53" r="5" fill="#FFD95C" />
        <circle cx="59" cy="53" r="5" fill="#76D7C4" />
        <circle cx="78" cy="53" r="5" fill="#FF9C82" />
        <path d="M37 69h43" stroke="#D8E8FF" strokeWidth="7" strokeLinecap="round" />
      </S.Illustration>
    );
  }

  return (
    <S.Illustration viewBox="0 0 120 92" aria-hidden="true">
      <circle cx="45" cy="35" r="17" fill="#FFFFFF" />
      <circle cx="79" cy="39" r="14" fill="#FFD95C" />
      <path d="M19 78c2-18 13-29 27-29 15 0 26 11 28 29H19Z" fill="#FFFFFF" />
      <path d="M62 78c1-14 9-23 19-23 11 0 20 9 21 23H62Z" fill="#FFD95C" />
    </S.Illustration>
  );
};
