import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, switchMap, tap } from 'rxjs';
import { API_BASE_URL } from './config';
import {
  ApiResponse,
  AuthResponse,
  RegisterRequest,
  UserProfileResponse,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  /** Present when a JWT exists (persists across refresh). */
  private readonly _token = signal<string | null>(localStorage.getItem('token'));
  private readonly _user = signal<UserProfileResponse | null>(null);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly role = computed(() => this._user()?.role ?? null);
  readonly isLoggedIn = computed(() => !!this._token());

  constructor() {
    if (this._token()) {
      this.loadProfile().subscribe({
        error: () => this.clearSession(),
      });
    }
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    this._token.set(null);
    this._user.set(null);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${API_BASE_URL}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.data.token);
          this._token.set(res.data.token);
        }),
        switchMap((res) => this.loadProfile().pipe(map(() => res.data)))
      );
  }

  register(body: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${API_BASE_URL}/auth/register`, body)
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.data.token);
          this._token.set(res.data.token);
        }),
        switchMap((res) => this.loadProfile().pipe(map(() => res.data)))
      );
  }

  refresh(): Observable<AuthResponse> {
    const t = localStorage.getItem('token');
    if (!t) throw new Error('No token');
    return this.http
      .post<ApiResponse<AuthResponse>>(`${API_BASE_URL}/auth/refresh`, { token: t })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.data.token);
          this._token.set(res.data.token);
        }),
        switchMap((res) => this.loadProfile().pipe(map(() => res.data)))
      );
  }

  loadProfile(): Observable<UserProfileResponse> {
    return this.http.get<ApiResponse<UserProfileResponse>>(`${API_BASE_URL}/users/me`).pipe(
      map((res) => res.data),
      tap((user) => this._user.set(user))
    );
  }

  logout(): void {
    this.clearSession();
    this.router.navigateByUrl('/login');
  }
}
