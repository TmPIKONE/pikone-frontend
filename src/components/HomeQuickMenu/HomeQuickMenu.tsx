import { useNavigate } from 'react-router-dom';
import { QuickMenuIllustration } from '~/components/QuickMenuIllustration/QuickMenuIllustration';
import type { HomeQuickAction } from './HomeQuickMenu.types';
import * as S from './HomeQuickMenu.styles';

const QUICK_ACTIONS: HomeQuickAction[] = [
  {
    title: '식사 기록',
    description: '사진 한 장으로\n오늘의 맛 남기기',
    path: '/record/add',
    illustration: 'record',
    tone: 'peach',
  },
  {
    title: 'AI 추천',
    description: '내 취향에 맞는\n맛집 추천받기',
    path: '/ai',
    illustration: 'ai',
    tone: 'lavender',
  },
  {
    title: '기록 달력',
    description: '한 달의 맛을\n달력으로 모아보기',
    path: '/calendar',
    illustration: 'calendar',
    tone: 'sky',
  },
  {
    title: '동반자',
    description: '함께한 식사를\n한눈에 확인하기',
    path: '/companion',
    illustration: 'companion',
    tone: 'mint',
  },
];

export const HomeQuickMenu = () => {
  const navigate = useNavigate();

  return (
    <S.Section>
      <S.Grid>
        {QUICK_ACTIONS.map((action) => (
          <S.Card
            key={action.path}
            type="button"
            $tone={action.tone}
            onClick={() => navigate(action.path)}
          >
            <S.CardTop>
              <S.Illustration>
                <QuickMenuIllustration type={action.illustration} />
              </S.Illustration>
              <S.Plus aria-hidden="true">+</S.Plus>
            </S.CardTop>

            <S.Text>
              <strong>{action.title}</strong>
              <span>{action.description}</span>
            </S.Text>
          </S.Card>
        ))}
      </S.Grid>
    </S.Section>
  );
};
