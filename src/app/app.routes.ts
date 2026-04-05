import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent) },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about-developer/about-developer.component').then((m) => m.AboutDeveloperComponent),
  },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent) },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'jobs/new',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'RECRUITER'] },
    loadComponent: () => import('./pages/job-form/job-form.component').then((m) => m.JobFormComponent),
  },
  {
    path: 'jobs/:id/edit',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'RECRUITER'] },
    loadComponent: () => import('./pages/job-form/job-form.component').then((m) => m.JobFormComponent),
  },
  {
    path: 'jobs/:jobId/applications',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'RECRUITER'] },
    loadComponent: () =>
      import('./pages/job-applications/job-applications.component').then((m) => m.JobApplicationsComponent),
  },
  {
    path: 'jobs/:id',
    canActivate: [authGuard],
    data: {
      authMessage: 'Please log in to view the full job description and apply.',
    },
    loadComponent: () => import('./pages/job-detail/job-detail.component').then((m) => m.JobDetailComponent),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'my-applications',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CANDIDATE'] },
    loadComponent: () =>
      import('./pages/my-applications/my-applications.component').then((m) => m.MyApplicationsComponent),
  },
  {
    path: 'saved-jobs',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CANDIDATE'] },
    loadComponent: () =>
      import('./pages/saved-jobs/saved-jobs.component').then((m) => m.SavedJobsComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  {
    path: 'users',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'RECRUITER'] },
    loadComponent: () => import('./pages/users/users.component').then((m) => m.UsersComponent),
  },
  { path: '**', redirectTo: '' },
];
