import { useApiQuery } from '~/apis/config/ApiBuilder';
import { getCompanionsBuilder } from '~/apis/companion/companion.api';
import type { CompanionResponse } from '~/apis/companion/companion.types';

export const useCompanions = () => {
  return useApiQuery<void, CompanionResponse[]>(getCompanionsBuilder(), ['companions']);
};
