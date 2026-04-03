import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const authMessage = route.data['authMessage'] as string | undefined;
  const loginQueryParams: Record<string, string> = { returnUrl: state.url };
  if (authMessage) {
    loginQueryParams['message'] = authMessage;
  }

  if (!auth.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: loginQueryParams });
    return false;
  }

  if (auth.user()) return true;

  return auth.loadProfile().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/login'], { queryParams: loginQueryParams });
      return of(false);
    })
  );
};
