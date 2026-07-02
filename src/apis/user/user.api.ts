import ApiBuilder from '../config/ApiBuilder';
import type { UserResponseDto } from './user.types';

const USERS = '/users';

export const getMyInfoBuilder = () =>
  ApiBuilder.create<void, UserResponseDto>(USERS).setMethod('GET');
