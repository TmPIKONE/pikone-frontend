import { useApiMutation } from '~/apis/config/ApiBuilder';
import { analyzeImageBuilder } from '~/apis/record/record.api';
import type { AiFoodResponse } from '~/apis/record/record.types';

export const useAnalyzeImage = (latitude?: number, longitude?: number) => {
  return useApiMutation<FormData, AiFoodResponse>(analyzeImageBuilder(latitude, longitude));
};
