import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const authGuard: CanActivateFn = () => {
  const router: Router = inject(Router);
  const jwtService: JwtHelperService = inject(JwtHelperService);

  if (jwtService.isTokenExpired()) {
    router.navigate(['']);
    return false;
  } else {
    return true;
  }
};
