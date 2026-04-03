import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../core/job.service';
import { JobRequest } from '../../models/api.models';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.css',
})
export class JobFormComponent {
  private readonly jobs = inject(JobService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly mode = signal<'create' | 'edit'>('create');
  readonly jobId = signal<number | null>(null);
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  form: JobRequest = {
    title: '',
    description: '',
    location: '',
    companyName: '',
  };

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.mode.set('edit');
      this.jobId.set(id);
      this.loading.set(true);
      this.jobs.getById(id).subscribe({
        next: (j) => {
          this.form = {
            title: j.title,
            description: j.description,
            location: j.location,
            companyName: j.companyName,
          };
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(e.error?.message || e.message || 'Failed to load job');
          this.loading.set(false);
        },
      });
    }
  }

  save(): void {
    this.error.set(null);
    this.loading.set(true);
    if (this.mode() === 'create') {
      this.jobs.create(this.form).subscribe({
        next: (j) => {
          this.loading.set(false);
          this.router.navigate(['/jobs', j.id]);
        },
        error: (e) => {
          this.error.set(e.error?.message || e.message || 'Save failed');
          this.loading.set(false);
        },
      });
    } else {
      const id = this.jobId();
      if (!id) return;
      this.jobs.update(id, this.form).subscribe({
        next: (j) => {
          this.loading.set(false);
          this.router.navigate(['/jobs', j.id]);
        },
        error: (e) => {
          this.error.set(e.error?.message || e.message || 'Save failed');
          this.loading.set(false);
        },
      });
    }
  }

  remove(): void {
    const id = this.jobId();
    if (!id || !confirm('Delete this job?')) return;
    this.loading.set(true);
    this.jobs.delete(id).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/');
      },
      error: (e) => {
        this.error.set(e.error?.message || e.message || 'Delete failed');
        this.loading.set(false);
      },
    });
  }
}
