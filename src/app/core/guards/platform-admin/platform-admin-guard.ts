import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {TokenService} from '../../services/token-service';

export const platformAdminGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  if (!tokenService.isPlatformAdmin) {
    void tokenService.logout();
    return false;
  }
  return true;
};
