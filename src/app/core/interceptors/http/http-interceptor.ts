import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../services/token-service';

/**
 * Cet intercepteur clone le jwt token et l'injecte dans les headers des services.
 * @param req : la requête HTTP
 * @param next: l'intercepteur
 */
export const httpInterceptor: HttpInterceptorFn = (req, next) => {
   const tokenService = inject(TokenService);
   const token = tokenService.getToken();
   let authReq = req;

   if (token) {
      authReq = req.clone({
         headers: new HttpHeaders({
            Authorization: `Bearer ${token}`
         })
      });
      return next(authReq);
   }
   return next(req);
};
