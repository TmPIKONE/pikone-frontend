import { logout, withdrawal } from '~/apis/auth/auth';
import { useApiMutation } from '~/apis/config/ApiBuilder';

export const useLogout = () => useApiMutation<void, void>(logout());

export const useWithdrawal = () => useApiMutation<void, void>(withdrawal());
