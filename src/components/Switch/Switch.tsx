import * as S from './Switch.styles';
import type { SwitchProps } from './Switch.types';

const Switch = ({ checked, onChange, disabled, ariaLabel }: SwitchProps) => {
  return (
    <S.SwitchButton
      type="button"
      $on={checked}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
    />
  );
};

export default Switch;
