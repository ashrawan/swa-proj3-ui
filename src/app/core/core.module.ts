import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationGuard } from '@app/auth/guards/authentication.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from './services/http-interceptor.service';



@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule
  ],
  providers: [AuthenticationGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
})
export class CoreModule { }
