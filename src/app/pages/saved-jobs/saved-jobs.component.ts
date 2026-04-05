import { CommonModule, SlicePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SavedJobService } from '../../core/saved-job.service';
import { JobResponse } from '../../models/api.models';

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [CommonModule, SlicePipe, RouterLink],
  templateUrl: './saved-jobs.component.html',
  styleUrl: './saved-jobs.component.css',
})
export class SavedJobsComponent {
  private readonly savedJobs = inject(SavedJobService);

  readonly list = signal<JobResponse[]>([]);
  readonly page = signal(0);
  readonly totalPages = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly pageSize = 10;

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.savedJobs
      .list({
        page: this.page(),
        size: this.pageSize,
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
