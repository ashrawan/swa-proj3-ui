import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, ParamMap, Params } from '@angular/router';
import { QueryParamKey } from '@app/core/core.constant';
import { JobDTO } from '@app/core/core.model';
import { SearchServiceService } from '@app/core/services/search-service.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  private unsubscribe = new Subject<void>();

  routeQueryParams: Params = {};
  paramMap!: ParamMap;

  jobs: JobDTO[] = [];

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private searchService: SearchServiceService) { }

  ngOnInit(): void {
    this.processRouteQueryParams();
  }

  private processRouteQueryParams(): void {
    this.route.queryParams
      .pipe(
        filter((val: Params) => val && Object.keys(val).length > 0),
        takeUntil(this.unsubscribe)
      )
      .subscribe((params: Params) => {
        this.routeQueryParams = params;
        const paramMap: ParamMap = convertToParamMap(params);
        this.paramMap = paramMap;
        const query = paramMap.get(QueryParamKey.SEARCH_QUERY) || '';
        if (query && query.length > 0) {
          this.searchRequest(query);
        }

      });
  }

  public searchRequest(query: string): void {
    this.searchService.getAllJobs(query).subscribe(response => {
      this.jobs = response;
    });
  }

}
