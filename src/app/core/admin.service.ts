import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './config';
import { AdminDashboardStatsResponse, ApiResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  stats(): Observable<AdminDashboardStatsResponse> {
    return this.http
      .get<ApiResponse<AdminDashboardStatsResponse>>(`${API_BASE_URL}/admin/stats`)
      .pipe(map((r) => r.data));
  }
}
