import { environment } from '@env/environment';
import { QueryParamKey } from './core.constant';

// "http://localhost:4200"  see: window.location.origin
export const CURRENT_WINDOW_URL = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');


const API_ENDPOINT = environment.apiUrl;
// API Endpoints
export class ApiEndpoints {

    static readonly API_URL = API_ENDPOINT;

    static readonly AUTH = {
        CUSTOM_USER_REGISTRATION: API_ENDPOINT + '/auth/register',
        CUSTOM_USER_LOGIN: API_ENDPOINT + '/auth/login',
        LOGOUT: API_ENDPOINT + '/logout',

    };

    static readonly SEARCH = {
        JOB_SEARCH: API_ENDPOINT + '/search/job/all',
        CANDIDATE_SEARCH: API_ENDPOINT + '/search/candidate',
    };

    // static readonly USERS = {
    //     MAIN: API_ENDPOINT + '/users',
    //     ME: API_ENDPOINT + '/users/me'
    // };

}