import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../../core/application.service';
import { JobApplicationResponse } from '../../models/api.models';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-applications.component.html',
  styleUrl: './my-applications.component.css',
})
export class MyApplicationsComponent {
  private readonly applications = inject(ApplicationService);

  readonly list = signal<JobApplicationResponse[]>([]);
  readonly page = signal(0);
  readonly totalPages = signal(0);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  statusFilter = '';
  keyword = '';
  readonly pageSize = 10;

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.applications
      .myApplications({
        page: this.page(),
        size: this.pageSize,
        status: this.statusFilter || undefined,
        keyword: this.keyword || undefined,
      })
      .subscribe({
        next: (p) => {
          this.list.set(p.content);
          this.totalPages.set(p.totalPages);
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(e.error?.message || e.message || 'Failed to load');
          this.loading.set(false);
        },
      });
  }

  search(): void {
    this.page.set(0);
    this.load();
  }

  prev(): void {
    if (this.page() > 0) {
      this.page.update((p) => p - 1);
      this.load();
    }
  }

  next(): void {
    if (this.page() < this.totalPages() - 1) {
      this.page.update((p) => p + 1);
      this.load();
    }
  }
}
