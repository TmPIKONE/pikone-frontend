import { useApiMutation } from '~/apis/config/ApiBuilder';
import { logout } from '~/apis/auth/auth';

export const useLogout = () => {
  return useApiMutation<void, void>(logout());
};
