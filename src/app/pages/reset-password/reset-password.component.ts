import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  constructor() {
    const q = this.route.snapshot.queryParamMap;
    this.token = q.get('token') ?? '';
    this.email = q.get('email') ?? '';
  }

  submit(): void {
    this.error.set(null);
    if (!this.token || !this.email) {
      this.error.set('Invalid reset link. Request a new reset email.');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }
    if (this.newPassword.length < 8) {
      this.error.set('Password must be at least 8 characters');
      return;
    }
    this.loading.set(true);
    this.auth.resetPassword(this.email, this.token, this.newPassword).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigateByUrl('/login');
      },
      error: (e: { error?: { message?: string }; message?: string }) => {
        this.error.set(e.error?.message || e.message || 'Reset failed');
        this.loading.set(false);
      },
    });
  }
}
