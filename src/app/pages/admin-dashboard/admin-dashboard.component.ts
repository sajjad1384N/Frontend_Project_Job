import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../core/admin.service';
import { AdminDashboardStatsResponse, AdminJobSummaryResponse } from '../../models/api.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  private readonly admin = inject(AdminService);

  readonly stats = signal<AdminDashboardStatsResponse | null>(null);
  readonly jobs = signal<AdminJobSummaryResponse[]>([]);
  readonly error = signal<string | null>(null);
  readonly loading = signal(true);

  constructor() {
    forkJoin({
      stats: this.admin.stats(),
      jobs: this.admin.jobsWithApplicationCounts(),
    }).subscribe({
      next: ({ stats, jobs }) => {
        this.stats.set(stats);
        this.jobs.set(jobs);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.error?.message || e.message || 'Failed to load dashboard');
        this.loading.set(false);
      },
    });
  }
}
