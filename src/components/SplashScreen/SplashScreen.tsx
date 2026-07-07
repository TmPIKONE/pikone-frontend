import pikoneLogo from '~/assets/branding/pikone-logo.png';
import * as S from './SplashScreen.styles';
import type { SplashScreenProps } from './SplashScreen.types';

const SplashScreen = (_props: SplashScreenProps) => {
  return (
    <S.Container>
      <S.Logo src={pikoneLogo} alt="PIKONE" />
    </S.Container>
  );
};

export default SplashScreen;
