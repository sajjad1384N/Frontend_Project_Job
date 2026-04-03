import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../core/admin.service';
import { AdminDashboardStatsResponse } from '../../models/api.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  private readonly admin = inject(AdminService);

  readonly stats = signal<AdminDashboardStatsResponse | null>(null);
  readonly error = signal<string | null>(null);
  readonly loading = signal(true);

  constructor() {
    this.admin.stats().subscribe({
      next: (s) => {
        this.stats.set(s);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.error?.message || e.message || 'Failed to load stats');
        this.loading.set(false);
      },
    });
  }
}
