import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './config';
import {
  ApiResponse,
  JobRequest,
  JobResponse,
  PageResponse,
} from '../models/api.models';

export interface JobListParams {
  page?: number;
  size?: number;
  keyword?: string;
  location?: string;
  company?: string;
}

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly http = inject(HttpClient);

  list(params: JobListParams = {}): Observable<PageResponse<JobResponse>> {
    let hp = new HttpParams();
    if (params.page != null) hp = hp.set('page', String(params.page));
    if (params.size != null) hp = hp.set('size', String(params.size));
    if (params.keyword) hp = hp.set('keyword', params.keyword);
    if (params.location) hp = hp.set('location', params.location);
    if (params.company) hp = hp.set('company', params.company);
    return this.http
      .get<ApiResponse<PageResponse<JobResponse>>>(`${API_BASE_URL}/jobs`, { params: hp })
      .pipe(map((r) => r.data));
  }

  getById(id: number): Observable<JobResponse> {
    return this.http
      .get<ApiResponse<JobResponse>>(`${API_BASE_URL}/jobs/${id}`)
      .pipe(map((r) => r.data));
  }

  create(body: JobRequest): Observable<JobResponse> {
    return this.http
      .post<ApiResponse<JobResponse>>(`${API_BASE_URL}/jobs`, body)
      .pipe(map((r) => r.data));
  }

  update(id: number, body: JobRequest): Observable<JobResponse> {
    return this.http
      .put<ApiResponse<JobResponse>>(`${API_BASE_URL}/jobs/${id}`, body)
      .pipe(map((r) => r.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${API_BASE_URL}/jobs/${id}`)
      .pipe(map(() => undefined));
  }
}
