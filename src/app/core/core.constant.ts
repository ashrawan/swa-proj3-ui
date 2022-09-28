import { environment } from "@env/environment";

export const appBrandName = environment.appBrandName || 'My App';

// Sync this with routing modules
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  CONTACT: '/contact',
  JOBS: '/jobs',


  DASHBOARD: '/dashboard',
};

export class QueryParamKey {

  static readonly TOKEN = "token";
  static readonly ERROR = "error";
  static readonly EMAIL = "email";

  // Authentication constants, API Authenntication flow will process this param ob the basis of the implementation logic
  static readonly REDIRECT_URI = "redirect_uri";
  static readonly ORIGINAL_REQUEST_URI = "original_request_uri";


  // Search Params
  static readonly SEARCH_QUERY = "q";

}

export class QueryParamUIKey {

  static readonly INFO_MESSAGE = "infoMessage";

  static readonly REGISTRATION_SUCCESSFUL = "registrationSuccess";


}


export const MESSAGE_RESPONSE_CONSTANTS = {

  Success_Action: 'Action Success',
  Operation_Failed_MSG: 'Oops! Something went wrong !!',

};

export const ERROR_CODES_CONSTANTS = {
  ServerDown: 0,
  BadRequest: 400,
  Unauthorized: 401,
  ResourceNotFound: 404,
  InternalServerError: 500,
};
