import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { updateAllergensBuilder } from '~/apis/allergen/allergen.api';
import type { AllergenRequest, AllergenResponse } from '~/apis/allergen/allergen.types';
import { useToast } from '~/components/Toast/Toast';

type OnSuccess = NonNullable<
  UseMutationOptions<AllergenResponse, unknown, AllergenRequest>['onSuccess']
>;

export const useUpdateAllergens = (
  options?: UseMutationOptions<AllergenResponse, unknown, AllergenRequest>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<AllergenRequest, AllergenResponse>(updateAllergensBuilder(), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['allergens'] });
      showToast('알레르기 정보를 저장했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('알레르기 저장에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};
