import { company_access_api } from './company_access_api.js';
import { company_middleware } from './company_middleware.js';
import { company_public_api } from './company_public_api.js';

export const companyApis = [
  company_middleware,
  company_access_api,
  company_public_api,

];
