import { logoutBuilder, withdrawalBuilder } from '~/apis/auth/auth.api';
import { useApiMutation } from '~/apis/config/queryHooks';

export const useLogout = () => useApiMutation<void, void>(logoutBuilder());

export const useWithdrawal = () => useApiMutation<void, void>(withdrawalBuilder());
