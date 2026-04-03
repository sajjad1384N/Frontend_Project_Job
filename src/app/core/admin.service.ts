import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './config';
import { AdminDashboardStatsResponse, AdminJobSummaryResponse, ApiResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  stats(): Observable<AdminDashboardStatsResponse> {
    return this.http
      .get<ApiResponse<AdminDashboardStatsResponse>>(`${API_BASE_URL}/admin/stats`)
      .pipe(map((r) => r.data));
  }

  jobsWithApplicationCounts(): Observable<AdminJobSummaryResponse[]> {
    return this.http
      .get<ApiResponse<AdminJobSummaryResponse[]>>(`${API_BASE_URL}/admin/jobs/application-counts`)
      .pipe(map((r) => r.data));
  }
}
