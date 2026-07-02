import { useApiQuery } from '~/apis/config/ApiBuilder';
import { getMyCompanionCodeBuilder } from '~/apis/companion/companion.api';
import type { MyCodeResponse } from '~/apis/companion/companion.types';

export const useMyCompanionCode = () => {
  return useApiQuery<void, MyCodeResponse>(getMyCompanionCodeBuilder(), ['companions', 'myCode']);
};
