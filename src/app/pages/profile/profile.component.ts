import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  readonly auth = inject(AuthService);
  private readonly users = inject(UserService);
  readonly message = signal<string | null>(null);
  readonly err = signal<string | null>(null);
  readonly refreshing = signal(false);
  readonly uploadingPhoto = signal(false);

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

  onPhotoPicked(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    this.err.set(null);
    this.message.set(null);
    this.uploadingPhoto.set(true);
    this.users.uploadAvatar(file).subscribe({
      next: () => {
        this.auth.loadProfile().subscribe({
          next: () => {
            this.message.set('Profile photo updated.');
            this.uploadingPhoto.set(false);
          },
          error: () => {
            this.uploadingPhoto.set(false);
          },
        });
      },
      error: (e) => {
        this.err.set(e.error?.message || e.message || 'Could not upload photo');
        this.uploadingPhoto.set(false);
      },
    });
  }
}
