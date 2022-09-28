import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, convertToParamMap, ParamMap, Params, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { ApiEndpoints } from '@app/core/app-url.constant';
import { UserDTO } from '@app/core/model/user.model';
import { Observable, of } from 'rxjs';
import { AuthResponse, JwtTokenPayload, LoginContext, RegisterContext } from '../auth.model';
import { Credentials, CredentialsService } from './credentials.service';
import { APP_ROUTES, QueryParamKey, QueryParamUIKey } from '@app/core/core.constant';
import { GenericResponse } from '@app/core/core.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  readonly AUTH_URL = ApiEndpoints.AUTH;

  constructor(private credentialsService: CredentialsService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient) {
  }

  public registerUser(registerContext: RegisterContext, redirectToLoginUri?: boolean): Observable<UserDTO> {
    const userDTOObservable: Observable<UserDTO> = this.http.post<UserDTO>(this.AUTH_URL.CUSTOM_USER_REGISTRATION, registerContext);
    const processedUserDTOObservable: Observable<UserDTO> = userDTOObservable.pipe(
      map((userDTO: UserDTO) => {
        if (redirectToLoginUri) {
          this.router.navigate([APP_ROUTES.LOGIN], { queryParams: { [QueryParamUIKey.REGISTRATION_SUCCESSFUL]: "Registration Successful, Please check your email for verification." }, replaceUrl: true });
        }
        return userDTO;
      })
    );
    return processedUserDTOObservable;
  }


  public login(loginContext: LoginContext, redirectAfterLogin: boolean = false, defaultRedirectUri: string | null = '/'): Observable<Credentials> {
    const authResponseObservable: Observable<AuthResponse> = this.http.post<AuthResponse>(this.AUTH_URL.CUSTOM_USER_LOGIN, loginContext);
    const generateCredentialsObservable: Observable<Credentials> = authResponseObservable.pipe(
      map((authResponse: AuthResponse) => {
        const tokenPayload: JwtTokenPayload = this.parseJwt(authResponse.token);
        const credentialsData: Credentials = {
          username: tokenPayload.username,
          token: authResponse.token,
          jwtTokenPayload: tokenPayload
        };
        this.credentialsService.setCredentials(credentialsData, loginContext.rememberMe);
        console.log('User Login successful generated credentials ', credentialsData);

        if (redirectAfterLogin) {
          if (defaultRedirectUri && defaultRedirectUri.length > 0) {
            defaultRedirectUri = defaultRedirectUri;
          } else {
            defaultRedirectUri = '/'
          }
          this.redirectToTargetRequestUri(defaultRedirectUri);
        }
        return credentialsData;
      })
    );

    return generateCredentialsObservable;
  }

  public logout(shouldRedirect: boolean = true, defaultRedirectUri: string = APP_ROUTES.LOGIN): Observable<boolean> {
    this.credentialsService.setCredentials(null);
    if (shouldRedirect) {
      this.redirectToTargetRequestUri(defaultRedirectUri);
    }
    return of(true);
  }

  public processAuthQueryParams(allowAuthRedirection: boolean = true): Observable<Params> {
    const processedQueryParamsObservable: Observable<Params> = this.route.queryParams
      .pipe(
        filter((params: Params) => params && Object.keys(params).length > 0),
        map((params: Params) => {
          const routeQueryParams: Params = { ...params }
          if (params && params.hasOwnProperty(QueryParamKey.TOKEN)) {
            const paramMap: ParamMap = convertToParamMap(routeQueryParams);
            if (paramMap.has(QueryParamKey.TOKEN)) {
              this.setSuccessCredentials(paramMap, allowAuthRedirection);
              delete routeQueryParams[QueryParamKey.TOKEN];
            }
          }
          return routeQueryParams;
        })
      );
    return processedQueryParamsObservable;
  }

  private setSuccessCredentials(resParamMap: ParamMap, redirectToOriginalUri?: boolean): boolean {
    console.log('Login Successful');
    const jwtToken = resParamMap.get('token') || '';
    const tokenPayload: JwtTokenPayload = this.parseJwt(jwtToken);
    const credentialsData: Credentials = {
      username: tokenPayload.username,
      token: jwtToken,
      jwtTokenPayload: tokenPayload
    };
    this.credentialsService.setCredentials(credentialsData, false);
    if (redirectToOriginalUri) {
      const originalRequestedUri = resParamMap.get(QueryParamKey.ORIGINAL_REQUEST_URI)
      this.redirectToTargetRequestUri(originalRequestedUri);
    }
    return true;
  }

  private redirectToTargetRequestUri(targetRequestedUri?: string | null): void {
    const targetUri = targetRequestedUri && targetRequestedUri.length > 0 ? targetRequestedUri : '/'
    this.router.navigate([targetUri]);
  }

  // OPTIONAL: Parsing JWT Token to obtain extra-data
  private parseJwt(token: any): JwtTokenPayload {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

    return JSON.parse(jsonPayload);
  };

}
