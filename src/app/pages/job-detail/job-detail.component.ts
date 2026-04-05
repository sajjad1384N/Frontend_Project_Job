import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApplicationService } from '../../core/application.service';
import { AuthService } from '../../core/auth.service';
import { JobService } from '../../core/job.service';
import { SavedJobService } from '../../core/saved-job.service';
import { JobResponse } from '../../models/api.models';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.css',
})
export class JobDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly jobs = inject(JobService);
  private readonly applications = inject(ApplicationService);
  private readonly savedJobs = inject(SavedJobService);
  readonly auth = inject(AuthService);

  readonly job = signal<JobResponse | null>(null);
  readonly error = signal<string | null>(null);
  readonly applyError = signal<string | null>(null);
  readonly applyOk = signal<string | null>(null);
  readonly loading = signal(true);
  readonly applying = signal(false);

  coverLetter = '';
  readonly resumeFile = signal<File | null>(null);
  readonly resumeName = signal<string>('');
  readonly saved = signal(false);
  readonly savedLoading = signal(false);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) {
      this.error.set('Invalid job');
      this.loading.set(false);
      return;
    }
    this.jobs.getById(id).subscribe({
      next: (j) => {
        this.job.set(j);
        this.loading.set(false);
        if (this.auth.role() === 'CANDIDATE') {
          this.savedJobs.isSaved(id).subscribe({
            next: (s) => this.saved.set(s),
            error: () => this.saved.set(false),
          });
        }
      },
      error: (e) => {
        this.error.set(e.error?.message || e.message || 'Job not found');
        this.loading.set(false);
      },
    });
  }

  onResumePicked(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const f = input.files?.[0] ?? null;
    this.resumeFile.set(f);
    this.resumeName.set(f?.name ?? '');
  }

  toggleSave(): void {
    const j = this.job();
    if (!j) return;
    this.savedLoading.set(true);
    const op = this.saved() ? this.savedJobs.remove(j.id) : this.savedJobs.save(j.id);
    op.subscribe({
      next: () => {
        this.saved.update((v) => !v);
        this.savedLoading.set(false);
      },
      error: () => this.savedLoading.set(false),
    });
  }

  apply(): void {
    const j = this.job();
    const file = this.resumeFile();
    if (!j || !file || j.closed) return;
    this.applyError.set(null);
    this.applyOk.set(null);
    this.applying.set(true);
    this.applications.apply(j.id, this.coverLetter, file).subscribe({
      next: () => {
        this.applying.set(false);
        this.router.navigateByUrl('/');
      },
      error: (e: { error?: unknown; message?: string }) => {
        const body = e.error;
        if (body instanceof Blob) {
          body.text().then((t) => {
            try {
              const parsed = JSON.parse(t) as { message?: string };
              this.applyError.set(parsed.message || 'Apply failed');
            } catch {
              this.applyError.set('Apply failed');
            }
          });
        } else if (body && typeof body === 'object' && 'message' in body) {
          this.applyError.set(String((body as { message: string }).message));
        } else {
          this.applyError.set(e.message || 'Apply failed');
        }
        this.applying.set(false);
      },
    });
  }
}
