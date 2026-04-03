import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from './config';
import { ApiResponse, PageResponse, UserProfileResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  list(params: {
    page?: number;
    size?: number;
    role?: string;
    keyword?: string;
  }): Observable<PageResponse<UserProfileResponse>> {
    let hp = new HttpParams();
    if (params.page != null) hp = hp.set('page', String(params.page));
    if (params.size != null) hp = hp.set('size', String(params.size));
    if (params.role) hp = hp.set('role', params.role);
    if (params.keyword) hp = hp.set('keyword', params.keyword);
    return this.http
      .get<ApiResponse<PageResponse<UserProfileResponse>>>(`${API_BASE_URL}/users`, { params: hp })
      .pipe(map((r) => r.data));
  }
}
