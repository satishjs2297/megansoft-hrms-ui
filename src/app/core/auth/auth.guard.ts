import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);

  const permission = route.data?.['permission'] as string | undefined;
  if (!permission || auth.hasPermission(permission)) return true;

  return router.createUrlTree([auth.getDefaultRoute()]);
};
