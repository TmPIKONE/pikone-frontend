import { useApiQuery } from '~/apis/config/ApiBuilder';
import { getAllergensBuilder } from '~/apis/allergen/allergen.api';
import type { AllergenResponse } from '~/apis/allergen/allergen.types';

export const useAllergens = () => {
  return useApiQuery<void, AllergenResponse>(getAllergensBuilder(), ['allergens']);
};
