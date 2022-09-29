import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Credentials, CredentialsService } from '@app/auth/services/credentials.service';
import { AuthenticationService } from '@app/auth/services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

    constructor(private credentialService: CredentialsService, private authenticationService: AuthenticationService, private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let apiRequest;
        if (this.credentialService.isAuthenticated()) {
        const credentials = this.credentialService.getCredentials();
            console.log('interceptor adding request token');
            apiRequest = req.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + credentials?.token
                }
            });
            console.log('api request ', apiRequest);
        } else {
            apiRequest = req.clone({});
        }

        return next
            .handle(apiRequest)
            .pipe(
                catchError(response => {
                    if (response instanceof HttpErrorResponse) {
                        switch (response.status) {
                            case 401:
                                this.router.parseUrl('/error/401');
                                break;
                            case 511:
                                this.authenticationService.logout();
                                this.router.parseUrl('/login');
                                break;
                        }
                    }
                    return throwError(response);
                })
            );
    }
}