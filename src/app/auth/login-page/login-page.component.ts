import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, ParamMap, Params, Router } from '@angular/router';
import { appBrandName, QueryParamKey, QueryParamUIKey } from '@app/core/core.constant';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { LoginContext } from '../auth.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  readonly appBrandName = appBrandName;

  // page state
  loading: boolean = false;
  hasError: boolean = false;
  loginResponseMessage: string | null = null;
  originalRequestedUri: string | null = null;

  // Form state
  loginForm!: FormGroup;
  isRememberMeChecked: boolean = false;
  isSubmitted = false;

  routeQueryParams: Params = {};

  private unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
  ) {
  }


  ngOnInit() {
    this.processRouteQueryParams();
    this.initializeLoginForm();
  }

  private processRouteQueryParams(): void {
    this.authenticationService.processAuthQueryParams()
      .pipe(
        filter((val: Params) => val && Object.keys(val).length > 0),
        takeUntil(this.unsubscribe)
      )
      .subscribe((params: Params) => {
        this.routeQueryParams = params;
        console.log('Login page routeQueryParams', this.routeQueryParams);
        const paramMap: ParamMap = convertToParamMap(params);
        this.originalRequestedUri = paramMap.get(QueryParamKey.ORIGINAL_REQUEST_URI)
        this.populateParamResponseMessage(paramMap, QueryParamKey.ERROR);
        this.populateParamResponseMessage(paramMap, QueryParamUIKey.REGISTRATION_SUCCESSFUL);
      });
  }

  populateParamResponseMessage(paramMap: ParamMap, paramKey: string, isErrorType: boolean = false) {
    if (paramMap.has(paramKey)) {
      const infoMsg = paramMap.get(paramKey);
      this.hasError = isErrorType ? true : false;
      this.loginResponseMessage = infoMsg && infoMsg.length > 0 ? infoMsg : null;
    }
  }

  initializeLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [true]
    });
  }

  get formControls(): { [p: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  onLoginSubmit(): void {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const formValue = this.loginForm.value;
    const loginContext: LoginContext = {
      username: formValue.email,
      password: formValue.password,
      rememberMe: formValue.rememberMe
    };
    this.loading = true;
    this.authenticationService.login(loginContext, true, this.originalRequestedUri)
      .pipe()
      .subscribe(
        res => {
          this.loading = false;
          this.hasError = false;
          this.loginResponseMessage = 'Login Successful';
          this.isSubmitted = false;
          this.loginForm.reset();
        },
        err => {
          this.loading = false;
          this.hasError = true;
          console.log(err);
          this.loginResponseMessage = err?.error?.response || 'Sorry! Something went wrong !!!';
        }
      );
  }


  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
