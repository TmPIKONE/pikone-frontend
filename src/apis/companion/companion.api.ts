import ApiBuilder from '../config/ApiBuilder';
import type {
  CompanionResponse,
  SendRequestDto,
  SendRequestResponse,
  PendingRequestResponse,
  RespondRequestDto,
  RespondRequestResponse,
  CreateLocalCompanionDto,
  CreateLocalCompanionResponse,
  UpdateDisplayNameDto,
  MyCodeResponse,
} from './companion.types';

const COMPANIONS = '/companions';
const COMPANIONS_REQUEST = '/companions/request';
const COMPANIONS_REQUEST_RESPOND = '/companions/request/respond';
const COMPANIONS_REQUEST_PENDING = '/companions/request/pending';
const COMPANIONS_LOCAL = '/companions/local';
const COMPANIONS_CODE = '/companions/code';

// 조회
export const getCompanionsBuilder = () =>
  ApiBuilder.create<void, CompanionResponse[]>(COMPANIONS).setMethod('GET');

export const getPendingCompanionRequestsBuilder = () =>
  ApiBuilder.create<void, PendingRequestResponse[]>(COMPANIONS_REQUEST_PENDING).setMethod('GET');

export const getMyCompanionCodeBuilder = () =>
  ApiBuilder.create<void, MyCodeResponse>(COMPANIONS_CODE).setMethod('GET');

// 변경
export const sendCompanionRequestBuilder = () =>
  ApiBuilder.create<SendRequestDto, SendRequestResponse>(COMPANIONS_REQUEST).setMethod('POST');

export const respondCompanionRequestBuilder = () =>
  ApiBuilder.create<RespondRequestDto, RespondRequestResponse>(
    COMPANIONS_REQUEST_RESPOND,
  ).setMethod('POST');

export const createLocalCompanionBuilder = () =>
  ApiBuilder.create<CreateLocalCompanionDto, CreateLocalCompanionResponse>(
    COMPANIONS_LOCAL,
  ).setMethod('POST');

export const updateCompanionNameBuilder = (companionId: number) =>
  ApiBuilder.create<UpdateDisplayNameDto, void>(`${COMPANIONS}/${companionId}/name`).setMethod(
    'PATCH',
  );

export const deleteCompanionBuilder = (companionId: number) =>
  ApiBuilder.create<void, void>(`${COMPANIONS}/${companionId}`).setMethod('DELETE');

export const cancelCompanionRequestBuilder = (requestId: number) =>
  ApiBuilder.create<void, void>(`${COMPANIONS_REQUEST}/${requestId}`).setMethod('DELETE');
