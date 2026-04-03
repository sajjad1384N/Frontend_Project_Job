import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/user.service';
import { UserProfileResponse } from '../../models/api.models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  private readonly usersApi = inject(UserService);

  readonly list = signal<UserProfileResponse[]>([]);
  readonly page = signal(0);
  readonly totalPages = signal(0);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  roleFilter = '';
  keyword = '';
  readonly pageSize = 10;

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.usersApi
      .list({
        page: this.page(),
        size: this.pageSize,
        role: this.roleFilter || undefined,
        keyword: this.keyword || undefined,
      })
      .subscribe({
        next: (p) => {
          this.list.set(p.content);
          this.totalPages.set(p.totalPages);
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(e.error?.message || e.message || 'Failed to load users');
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
