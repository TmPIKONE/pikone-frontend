import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation, useApiQuery } from '~/apis/config/queryHooks';
import {
  createHomeLocationBuilder,
  deleteHomeLocationBuilder,
  getHomeLocationsBuilder,
  updateHomeLocationBuilder,
} from '~/apis/homeLocation/homeLocation.api';
import type {
  HomeLocationCreateRequest,
  HomeLocationResponse,
  HomeLocationUpdateRequest,
} from '~/apis/homeLocation/homeLocation.types';
import { queryKeys } from '~/apis/queryKeys';
import { useToast } from '~/components/Toast/useToast';

type CreateOptions = UseMutationOptions<HomeLocationResponse, unknown, HomeLocationCreateRequest>;
type CreateSuccess = NonNullable<CreateOptions['onSuccess']>;
type UpdateOptions = UseMutationOptions<void, unknown, HomeLocationUpdateRequest>;
type UpdateSuccess = NonNullable<UpdateOptions['onSuccess']>;
type VoidSuccess = NonNullable<UseMutationOptions<void, unknown, void>['onSuccess']>;

export const useHomeLocations = () =>
  useApiQuery<void, HomeLocationResponse[]>(getHomeLocationsBuilder(), queryKeys.homeLocations.all);

export const useCreateHomeLocation = (options?: CreateOptions) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<HomeLocationCreateRequest, HomeLocationResponse>(
    createHomeLocationBuilder(),
    {
      ...options,
      onSuccess: (...args: Parameters<CreateSuccess>) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.homeLocations.all });
        showToast('고정 장소를 추가했어요.');
        options?.onSuccess?.(...args);
      },
      onError: (...args) => {
        showToast('고정 장소 추가에 실패했어요.', 'error');
        options?.onError?.(...args);
      },
    },
  );
};

export const useDeleteHomeLocation = (
  id: number,
  options?: UseMutationOptions<void, unknown, void>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<void, void>(deleteHomeLocationBuilder(id), {
    ...options,
    onSuccess: (...args: Parameters<VoidSuccess>) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homeLocations.all });
      showToast('고정 장소를 삭제했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('고정 장소 삭제에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};

export const useUpdateHomeLocation = (id: number, options?: UpdateOptions) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<HomeLocationUpdateRequest, void>(updateHomeLocationBuilder(id), {
    ...options,
    onSuccess: (...args: Parameters<UpdateSuccess>) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.homeLocations.all });
      showToast('고정 장소를 수정했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('고정 장소 수정에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};
