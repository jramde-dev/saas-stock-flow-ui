import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {TokenService} from '../../services/token-service';

export const tenantCheckerGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  if (!tokenService.isTenantUser) {
    void tokenService.logout();
    return false;
  }
  return true;
};
