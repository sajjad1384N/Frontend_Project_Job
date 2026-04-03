import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Shown when redirected from a protected route (e.g. job detail). */
  readonly infoMessage = toSignal(
    this.route.queryParamMap.pipe(map((q) => q.get('message'))),
    { initialValue: this.route.snapshot.queryParamMap.get('message') }
  );

  email = '';
  password = '';
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  submit(): void {
    this.error.set(null);
    this.loading.set(true);
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        const url = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
        this.router.navigateByUrl(url);
      },
      error: (e) => {
        this.error.set(e.error?.message || e.message || 'Login failed');
        this.loading.set(false);
      },
    });
  }
}
