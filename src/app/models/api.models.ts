export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type Role = 'ADMIN' | 'RECRUITER' | 'CANDIDATE';

export interface JobResponse {
  id: number;
  title: string;
  description: string;
  location: string;
  companyName: string;
  /** ISO-8601 instant when applications close; omitted or null if no deadline. */
  closingAt?: string | null;
  /** True when closingAt is set and not in the future. */
  closed?: boolean;
}

export interface JobRequest {
  title: string;
  description: string;
  location: string;
  companyName: string;
  closingAt?: string | null;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
}

export interface UserProfileResponse {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  /** e.g. `users/me/avatar` — fetch with auth to display image */
  avatarUrl?: string | null;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}

export interface AdminDashboardStatsResponse {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalApplied: number;
  totalShortlisted: number;
  totalRejected: number;
}

export interface AdminJobSummaryResponse {
  jobId: number;
  title: string;
  companyName: string;
  applicationCount: number;
}

export type ApplicationStatus = 'APPLIED' | 'SHORTLISTED' | 'REJECTED';

export interface JobApplicationResponse {
  id: number;
  jobId: number;
  jobTitle: string;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  status: ApplicationStatus;
  coverLetter: string;
  resumeOriginalFilename: string | null;
  appliedAt: string;
}

export interface ApplicationStatusUpdateRequest {
  status: 'SHORTLISTED' | 'REJECTED';
}
