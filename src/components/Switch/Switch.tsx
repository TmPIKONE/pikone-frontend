import * as S from './Switch.styles';
import type { SwitchProps } from './Switch.types';

const Switch = ({ checked, onChange, disabled, ariaLabel }: SwitchProps) => {
  return (
    <S.SwitchButton
      type="button"
      $on={checked}
      disabled={disabled}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
    />
  );
};

export default Switch;
