import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { updateAllergensBuilder } from '~/apis/allergen/allergen.api';
import type { AllergenRequest, AllergenResponse } from '~/apis/allergen/allergen.types';

type OnSuccess = NonNullable<
  UseMutationOptions<AllergenResponse, unknown, AllergenRequest>['onSuccess']
>;

export const useUpdateAllergens = (
  options?: UseMutationOptions<AllergenResponse, unknown, AllergenRequest>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation<AllergenRequest, AllergenResponse>(updateAllergensBuilder(), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['allergens'] });
      options?.onSuccess?.(...args);
    },
  });
};
