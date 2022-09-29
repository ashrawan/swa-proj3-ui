import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiEndpoints } from '../app-url.constant';
import { JobDTO } from '../core.model';

@Injectable({
  providedIn: 'root'
})
export class SearchServiceService {

  constructor(private http: HttpClient) {
  }

  getAllJobs(q: string): Observable<JobDTO[]> {
    const options =  {
      params: {
        title: q
      }
    };
    const jobObservable: Observable<JobDTO[]> = this.http.get<JobDTO[]>(ApiEndpoints.SEARCH.JOB_SEARCH, options).pipe(
      map(
        (jobs: JobDTO[]) => {
          return jobs;
        })
    );
    return jobObservable;
  }

  getJobById(jobId: number): Observable<JobDTO> {
    const jobObservable: Observable<JobDTO> = this.http.get<JobDTO>(ApiEndpoints.SEARCH.JOB_SEARCH + '/' + jobId).pipe(
      map(
        (job: JobDTO) => {
          return job;
        })
    );
    return jobObservable;
  }


}
