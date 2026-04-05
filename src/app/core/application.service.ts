import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './config';
import {
  ApiResponse,
  ApplicationStatusUpdateRequest,
  JobApplicationResponse,
  PageResponse,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly http = inject(HttpClient);

  apply(jobId: number, coverLetter: string, resume: File): Observable<JobApplicationResponse> {
    const fd = new FormData();
    fd.append('coverLetter', coverLetter);
    fd.append('resume', resume, resume.name);
    return this.http
      .post<ApiResponse<JobApplicationResponse>>(`${API_BASE_URL}/applications/jobs/${jobId}`, fd)
      .pipe(map((r) => r.data));
  }

  downloadResume(jobId: number, applicationId: number): Observable<Blob> {
    return this.http.get(`${API_BASE_URL}/applications/jobs/${jobId}/${applicationId}/resume`, {
      responseType: 'blob',
    });
  }

  myApplications(params: {
    page?: number;
    size?: number;
    status?: string;
    keyword?: string;
  }): Observable<PageResponse<JobApplicationResponse>> {
    let hp = new HttpParams();
    if (params.page != null) hp = hp.set('page', String(params.page));
    if (params.size != null) hp = hp.set('size', String(params.size));
    if (params.status) hp = hp.set('status', params.status);
    if (params.keyword) hp = hp.set('keyword', params.keyword);
    return this.http
      .get<ApiResponse<PageResponse<JobApplicationResponse>>>(`${API_BASE_URL}/applications/me`, {
        params: hp,
      })
      .pipe(map((r) => r.data));
  }

  byJob(
    jobId: number,
    params: { page?: number; size?: number; status?: string; keyword?: string }
  ): Observable<PageResponse<JobApplicationResponse>> {
    let hp = new HttpParams();
    if (params.page != null) hp = hp.set('page', String(params.page));
    if (params.size != null) hp = hp.set('size', String(params.size));
    if (params.status) hp = hp.set('status', params.status);
    if (params.keyword) hp = hp.set('keyword', params.keyword);
    return this.http
      .get<ApiResponse<PageResponse<JobApplicationResponse>>>(
        `${API_BASE_URL}/applications/jobs/${jobId}`,
        { params: hp }
      )
      .pipe(map((r) => r.data));
  }

  updateStatus(
    jobId: number,
    applicationId: number,
    body: ApplicationStatusUpdateRequest
  ): Observable<JobApplicationResponse> {
    return this.http
      .patch<ApiResponse<JobApplicationResponse>>(
        `${API_BASE_URL}/applications/jobs/${jobId}/${applicationId}/status`,
        body
      )
      .pipe(map((r) => r.data));
  }

  exportJobApplicationsCsv(jobId: number): Observable<Blob> {
    return this.http.get(`${API_BASE_URL}/applications/jobs/${jobId}/export`, {
      responseType: 'blob',
    });
  }
}
