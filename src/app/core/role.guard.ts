import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = route.data['roles'] as string[] | undefined;
  if (!roles?.length) return true;

  const allow = (r: string | null) => {
    if (r && roles.includes(r)) return true;
    router.navigateByUrl('/');
    return false;
  };

  if (auth.user()) return allow(auth.role());

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  return auth.loadProfile().pipe(
    map(() => allow(auth.role())),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
