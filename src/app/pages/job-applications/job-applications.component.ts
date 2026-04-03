import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApplicationService } from '../../core/application.service';
import { JobService } from '../../core/job.service';
import { ApplicationStatus, JobApplicationResponse } from '../../models/api.models';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './job-applications.component.html',
  styleUrl: './job-applications.component.css',
})
export class JobApplicationsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly applications = inject(ApplicationService);
  private readonly jobs = inject(JobService);

  readonly jobTitle = signal<string>('');
  readonly list = signal<JobApplicationResponse[]>([]);
  readonly page = signal(0);
  readonly totalPages = signal(0);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly updating = signal<number | null>(null);
  readonly downloading = signal<number | null>(null);

  jobId!: number;
  statusFilter = '';
  keyword = '';
  readonly pageSize = 10;

  constructor() {
    this.jobId = Number(this.route.snapshot.paramMap.get('jobId'));
    this.jobs.getById(this.jobId).subscribe({
      next: (j) => this.jobTitle.set(j.title),
      error: () => this.jobTitle.set('Job'),
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.applications
      .byJob(this.jobId, {
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

  downloadResume(app: JobApplicationResponse): void {
    if (!app.resumeOriginalFilename) return;
    this.downloading.set(app.id);
    this.applications.downloadResume(this.jobId, app.id).subscribe({
      next: (blob) => {
        const name = app.resumeOriginalFilename || 'resume';
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
        this.downloading.set(null);
      },
      error: () => this.downloading.set(null),
    });
  }

  setStatus(app: JobApplicationResponse, status: ApplicationStatus): void {
    if (status === 'APPLIED') return;
    this.updating.set(app.id);
    this.applications.updateStatus(this.jobId, app.id, { status }).subscribe({
      next: (updated) => {
        this.list.update((rows) => rows.map((r) => (r.id === updated.id ? updated : r)));
        this.updating.set(null);
      },
      error: () => this.updating.set(null),
    });
  }
}
