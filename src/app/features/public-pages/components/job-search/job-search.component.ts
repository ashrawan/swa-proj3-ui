import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from '@app/core/core.constant';

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.scss']
})
export class JobSearchComponent implements OnInit {

  searchText!: string;

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  onSearchSubmit() {
    const jobsBrowseQueryParams = {
      q: this.searchText
    };
    this.router.navigate([APP_ROUTES.JOBS], { queryParams: jobsBrowseQueryParams, queryParamsHandling: 'merge' });
  }

}
