import { CommonModule, SlicePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService } from '../../core/job.service';
import { JobResponse } from '../../models/api.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SlicePipe, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly jobs = inject(JobService);

  readonly list = signal<JobResponse[]>([]);
  readonly page = signal(0);
  readonly totalPages = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  keyword = '';
  location = '';
  company = '';
  readonly pageSize = 10;

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.jobs
      .list({
        page: this.page(),
        size: this.pageSize,
        keyword: this.keyword || undefined,
        location: this.location || undefined,
        company: this.company || undefined,
      })
      .subscribe({
        next: (p) => {
          this.list.set(p.content);
          this.totalPages.set(p.totalPages);
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(e.error?.message || e.message || 'Failed to load jobs');
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
