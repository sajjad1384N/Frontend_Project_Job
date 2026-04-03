import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, of, catchError } from 'rxjs';
import { API_BASE_URL } from './core/config';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-header-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (avatarSrc()) {
      <img [src]="avatarSrc()!" [alt]="label()" class="avatar-img" width="36" height="36" />
    } @else {
      <span class="avatar-fallback" [attr.aria-label]="label()">{{ initials() }}</span>
    }
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        flex-shrink: 0;
      }
      .avatar-img {
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid var(--border);
      }
      .avatar-fallback {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--surface-hover);
        border: 1px solid var(--border);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--accent);
      }
    `,
  ],
})
export class HeaderAvatarComponent {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private lastBlobUrl: string | null = null;

  readonly label = computed(() => this.auth.user()?.fullName ?? this.auth.user()?.email ?? 'User');

  readonly initials = computed(() => {
    const n = this.auth.user()?.fullName?.trim() || this.auth.user()?.email || '?';
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  });

  readonly avatarSrc = signal<string | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => this.revokeLast());

    toObservable(this.auth.user)
      .pipe(
        switchMap((u) => {
          this.revokeLast();
          this.avatarSrc.set(null);
          const path = u?.avatarUrl;
          if (!path) return of(null);
          return this.http.get(`${API_BASE_URL}/${path}`, { responseType: 'blob' }).pipe(
            map((blob) => {
              const url = URL.createObjectURL(blob);
              this.lastBlobUrl = url;
              return url;
            }),
            catchError(() => of(null))
          );
        }),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe((url) => this.avatarSrc.set(url));
  }

  private revokeLast(): void {
    if (this.lastBlobUrl) {
      URL.revokeObjectURL(this.lastBlobUrl);
      this.lastBlobUrl = null;
    }
  }
}
