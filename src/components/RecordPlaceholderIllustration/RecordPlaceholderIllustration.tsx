import type { RecordPlaceholderIllustrationProps } from './RecordPlaceholderIllustration.types';
import * as S from './RecordPlaceholderIllustration.styles';

export const RecordPlaceholderIllustration = ({
  className,
}: RecordPlaceholderIllustrationProps) => (
  <S.Illustration className={className} viewBox="0 0 124 92" aria-hidden="true">
    <rect x="23" y="20" width="78" height="58" rx="18" fill="#FFFFFF" />
    <circle cx="62" cy="49" r="18" fill="#FFD95C" />
    <path d="M48 58c9-10 20-10 29 0" stroke="#FF9C82" strokeWidth="7" strokeLinecap="round" />
    <circle cx="54" cy="44" r="2.5" fill="#244A7C" />
    <circle cx="70" cy="44" r="2.5" fill="#244A7C" />
    <path d="M93 16l3 7 7 3-6 4v8l-6-4-7 4 2-8-6-4 8-2 5-8Z" fill="#76D7C4" />
  </S.Illustration>
);
