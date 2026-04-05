import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './config';
import { ApiResponse, JobResponse, PageResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class SavedJobService {
  private readonly http = inject(HttpClient);

  list(params: { page?: number; size?: number } = {}): Observable<PageResponse<JobResponse>> {
    let hp = new HttpParams();
    if (params.page != null) hp = hp.set('page', String(params.page));
    if (params.size != null) hp = hp.set('size', String(params.size));
    return this.http
      .get<ApiResponse<PageResponse<JobResponse>>>(`${API_BASE_URL}/saved-jobs`, { params: hp })
      .pipe(map((r) => r.data));
  }

  isSaved(jobId: number): Observable<boolean> {
    return this.http
      .get<ApiResponse<boolean>>(`${API_BASE_URL}/saved-jobs/jobs/${jobId}/saved`)
      .pipe(map((r) => r.data));
  }

  save(jobId: number): Observable<void> {
    return this.http
      .post<ApiResponse<void>>(`${API_BASE_URL}/saved-jobs/jobs/${jobId}`, {})
      .pipe(map(() => undefined));
  }

  remove(jobId: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${API_BASE_URL}/saved-jobs/jobs/${jobId}`)
      .pipe(map(() => undefined));
  }
}
