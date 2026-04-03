import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  readonly auth = inject(AuthService);
  readonly message = signal<string | null>(null);
  readonly err = signal<string | null>(null);
  readonly refreshing = signal(false);

  refresh(): void {
    this.message.set(null);
    this.err.set(null);
    this.refreshing.set(true);
    this.auth.refresh().subscribe({
      next: () => {
        this.message.set('Session refreshed.');
        this.refreshing.set(false);
      },
      error: (e) => {
        this.err.set(e.error?.message || e.message || 'Refresh failed');
        this.refreshing.set(false);
      },
    });
  }
}
