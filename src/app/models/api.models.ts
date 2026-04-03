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
}

export interface JobRequest {
  title: string;
  description: string;
  location: string;
  companyName: string;
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
