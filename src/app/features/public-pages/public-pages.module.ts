import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicPagesWrapperComponent } from './public-pages-wrapper.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { HomeNavbarComponent } from './components/home-navbar/home-navbar.component';
import { PublicPagesRoutingModule } from './public-pages-routing.module';
import { FormsModule } from '@angular/forms';
import { JobSearchComponent } from './components/job-search/job-search.component';
import { FooterComponent } from './components/footer/footer.component';
import { JobsComponent } from './jobs/jobs.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


@NgModule({
  declarations: [
    HomePageComponent,
    ContactPageComponent,
    PublicPagesWrapperComponent,
    HomeNavbarComponent,
    JobSearchComponent,
    FooterComponent,
    JobsComponent,
  ],
  imports: [
    CommonModule,
    PublicPagesRoutingModule,
    FormsModule,
    BsDropdownModule.forRoot()
  ]
})
export class PublicPagesModule { }
