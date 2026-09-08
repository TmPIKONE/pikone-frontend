import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { getAllergensBuilder, updateAllergensBuilder } from '~/apis/allergen/allergen.api';
import type { AllergenRequest, AllergenResponse } from '~/apis/allergen/allergen.types';
import { useApiMutation, useApiQuery } from '~/apis/config/queryHooks';
import { queryKeys } from '~/apis/queryKeys';
import { useToast } from '~/components/Toast/useToast';

type UpdateOptions = UseMutationOptions<AllergenResponse, unknown, AllergenRequest>;
type OnUpdateSuccess = NonNullable<UpdateOptions['onSuccess']>;

export const useAllergens = () =>
  useApiQuery<void, AllergenResponse>(getAllergensBuilder(), queryKeys.allergens.all);

export const useUpdateAllergens = (options?: UpdateOptions) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<AllergenRequest, AllergenResponse>(updateAllergensBuilder(), {
    ...options,
    onSuccess: (...args: Parameters<OnUpdateSuccess>) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allergens.all });
      showToast('알레르기 정보를 저장했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('알레르기 저장에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};
