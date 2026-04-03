import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Role } from '../../models/api.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  fullName = '';
  email = '';
  password = '';
  role: Role = 'CANDIDATE';

  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  readonly roles: Role[] = ['CANDIDATE', 'RECRUITER', 'ADMIN'];

  submit(): void {
    this.error.set(null);
    this.loading.set(true);
    this.auth
      .register({
        fullName: this.fullName,
        email: this.email,
        password: this.password,
        role: this.role,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigateByUrl('/');
        },
        error: (e) => {
          this.error.set(e.error?.message || e.message || 'Registration failed');
          this.loading.set(false);
        },
      });
  }
}
