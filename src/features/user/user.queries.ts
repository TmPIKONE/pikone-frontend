import { useApiQuery } from '~/apis/config/queryHooks';
import { queryKeys } from '~/apis/queryKeys';
import { getMyInfoBuilder } from '~/apis/user/user.api';

export const useMyInfo = () => useApiQuery(getMyInfoBuilder(), queryKeys.user.me);
