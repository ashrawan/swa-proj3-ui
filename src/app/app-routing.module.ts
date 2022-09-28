import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupPageComponent } from './auth/signup-page/signup-page.component';
import { LoginPageComponent } from './auth/login-page/login-page.component';

const routes: Routes = [

  {
    path: 'register',
    component: SignupPageComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },

  {
    path: '',
    loadChildren: () => import('@app/features/features.module')
      .then(m => m.FeaturesModule),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
