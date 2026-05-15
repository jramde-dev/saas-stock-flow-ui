import {CanActivateFn} from '@angular/router';
import {TokenService} from '../../services/token-service';
import {inject} from '@angular/core';

/**
 * Ce guard protège les urls si l'utilisateur n'est pas connecté.
 * @param route
 * @param state
 */
export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  if (!tokenService.isTokenValid) {
    void tokenService.logout();
    return false;
  }
  return true;
};
