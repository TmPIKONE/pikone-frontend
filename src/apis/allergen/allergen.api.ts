import ApiBuilder from '../config/ApiBuilder';
import type { AllergenRequest, AllergenResponse } from './allergen.types';

const ALLERGENS = '/allergens';

export const getAllergensBuilder = () =>
  ApiBuilder.create<void, AllergenResponse>(ALLERGENS).setMethod('GET');

export const updateAllergensBuilder = () =>
  ApiBuilder.create<AllergenRequest, AllergenResponse>(ALLERGENS).setMethod('POST');
