import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  if (user) {
    if (!user.name) {
      router.navigate(['/profile-setup']);
      return false;
    }
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
