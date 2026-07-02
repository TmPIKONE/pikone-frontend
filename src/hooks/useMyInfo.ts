import { useApiQuery } from '~/apis/config/ApiBuilder';
import { getMyInfoBuilder } from '~/apis/user/user.api';

export const useMyInfo = () => {
  return useApiQuery(getMyInfoBuilder(), ['user', 'me']);
};
