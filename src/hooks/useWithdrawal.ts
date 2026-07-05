import { useApiMutation } from '~/apis/config/ApiBuilder';
import { withdrawal } from '~/apis/auth/auth';

export const useWithdrawal = () => {
  return useApiMutation<void, void>(withdrawal());
};
