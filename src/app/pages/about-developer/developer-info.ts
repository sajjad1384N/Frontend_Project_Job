/**
 * Replace email and phone with your real contact details before sharing publicly.
 *
 * Photo: put your image in the `public/` folder (e.g. `developer-photo.jpg`) and set `photoUrl`
 * to that filename, or use a full https:// URL. Use `''` to show initials only (no image).
 */
export const DEVELOPER_INFO = {
  name: 'Md Sajjad Ansari',
  role: 'Java Developer',
  /** One line under the page title (keep short). */
  educationShort: 'B.Tech CSE · MNIT Jaipur · 2025',
  /** e.g. `developer-photo.svg` (placeholder) or `developer-photo.jpg` — files live in `public/` */
  photoUrl: 'image.jpg',
  /** Text under the photo. Leave '' to hide. */
  photoCaption: '',
  /** Shown under your name & role — product outcomes (e.g. recruiter flows). */
  profileHighlights: [
    'Recruiters and admins download each candidate’s résumé from the job’s Applications page (secure file download).',
  ],
  /**
   * Your CV file in the `public/` folder (e.g. `md-sajjad-ansari-resume.pdf`), or a full https:// URL.
   * Leave '' to hide the download button.
   */
  developerResumeUrl: 'md-sajjad-ansari-resume.pdf',
  /** Button label for the résumé link */
  developerResumeLabel: 'Download developer resume (PDF)',
  /** About text — blank lines become separate paragraphs on the page. */
  bio: `B.Tech in Computer Science and Engineering from MNIT Jaipur (2025). Java developer.

Built this job portal with Angular, Spring Boot, and MySQL — jobs, applications, and admin tools in one place.

The frontend is an Angular SPA with TypeScript: routed pages, auth guards, and REST calls to a Spring Boot API. The backend uses Spring Security with JWT, role-based access (candidates, recruiters, admins), and JPA over MySQL for jobs, users, and applications. Features include job search and posting, apply-with-resume uploads, application tracking, and an admin dashboard with stats — all exposed through a clean REST API.`,
  /** Add your email (e.g. name@gmail.com) */
  email: 'sajjadansari1384@gmail.com',
  /** Add your phone with country code, e.g. +91 98765 43210 */
  phone: '+91 7462947196',
  /** Optional URLs — leave '' to hide */
  website: '' as string,
  github: '' as string,
  linkedin: '' as string,
  technologies: [
    'Java',
    'C++',
    'React',
    'Mongo DB',
    'Spring Boot',
    'Spring Security',
    'JWT',
    'REST API',
    'MySQL',
    'JPA',
    'Angular',
    'TypeScript',
  ],
};
