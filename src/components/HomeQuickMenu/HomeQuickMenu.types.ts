import type { QuickMenuIllustrationType } from '~/components/QuickMenuIllustration/QuickMenuIllustration.types';

export type HomeCardTone = 'peach' | 'lavender' | 'sky' | 'mint';

export interface HomeQuickAction {
  title: string;
  description: string;
  path: string;
  illustration: QuickMenuIllustrationType;
  tone: HomeCardTone;
}

export type HomeQuickMenuProps = Record<never, never>;
