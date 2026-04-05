import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DEVELOPER_INFO } from './developer-info';

@Component({
  selector: 'app-about-developer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-developer.component.html',
  styleUrl: './about-developer.component.css',
})
export class AboutDeveloperComponent {
  readonly dev = DEVELOPER_INFO;
  /** Hide broken image and show initials */
  readonly photoFailed = signal(false);

  constructor() {
    inject(Title).setTitle('About the developer · Job Portal');
  }

  /** Absolute path or external URL for <img src> */
  photoSrc(): string {
    const u = this.dev.photoUrl.trim();
    if (!u) return '';
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    return u.startsWith('/') ? u : '/' + u;
  }

  showInitials(): boolean {
    return !this.dev.photoUrl.trim() || this.photoFailed();
  }

  onPhotoError(): void {
    this.photoFailed.set(true);
  }

  initials(): string {
    const n = this.dev.name.trim();
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase() || '?';
  }

  /** tel: link — strips spaces for dialer */
  phoneHref(): string {
    const p = this.dev.phone.trim();
    if (!p) return '';
    return 'tel:' + p.replace(/\s/g, '');
  }

  /** Split bio on blank lines for nicer paragraphs */
  bioParagraphs(): string[] {
    return this.dev.bio
      .split(/\n\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  /** Under-photo label; empty hides the line */
  photoCaptionText(): string {
    return this.dev.photoCaption?.trim() ?? '';
  }

  photoAlt(): string {
    return this.dev.name.trim() || 'Developer';
  }

  /** Public folder path or absolute URL for the developer’s résumé */
  resumeHref(): string {
    const u = this.dev.developerResumeUrl?.trim() ?? '';
    if (!u) return '';
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    return u.startsWith('/') ? u : '/' + u;
  }
}
