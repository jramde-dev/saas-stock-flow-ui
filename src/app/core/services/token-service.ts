import { inject, Injectable } from '@angular/core';
import { JrLoginResponse } from '../../api-services/models/jr-login-response';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

/**
 * Ce service est chargé de gérer toutes les informations JWT token.
 */

@Injectable({
   providedIn: 'root'
})
export class TokenService {
   private readonly router = inject(Router);

   setToken(loginResponse: JrLoginResponse) {
      localStorage.setItem('token', <string>loginResponse.accessToken);
   }

   getToken() {
      return localStorage.getItem('token');
   }

   get userRole(): string {
      const token = this.getToken();

      if (token) {
         const jwtHelper = new JwtHelperService();
         const decodedToken = jwtHelper.decodeToken(token);
         return decodedToken['role'];
      }
      return '';
   }

   get userId(): string {
      const token = this.getToken();

      if (token) {
         const jwtHelper = new JwtHelperService();
         const decodedToken = jwtHelper.decodeToken(token);
         return decodedToken['sub'];
      }
      return '';
   }

   get tenantId(): string {
      const token = this.getToken();

      if (token) {
         const jwtHelper = new JwtHelperService();
         const decodedToken = jwtHelper.decodeToken(token);
         return decodedToken['tenantId'];
      }
      return '';
   }

   get isPlatformAdmin(): boolean {
      return this.userRole === 'ROLE_PLATFORM_ADMIN';
   }

   get isCompanyAdmin(): boolean {
      return this.userRole === 'ROLE_COMPANY_ADMIN';
   }

   get isAdministrator(): boolean {
      return this.userRole === 'ROLE_ADMINISTRATOR';
   }

   get isSalesOperator(): boolean {
      return this.userRole === 'ROLE_SALES_OPERATOR';
   }

   get isUser(): boolean {
      return this.userRole === 'ROLE_USER';
   }

   get isTokenValid(): boolean {
      const token = this.getToken();

      if (token) {
         const jwtHelper = new JwtHelperService();
         const isExpired = jwtHelper.isTokenExpired(token);

         if (isExpired) {
            this.logout();
            return false;
         }
         return true;
      }
      return false;
   }

   async logout() {
      await this.router.navigate(['login']);
      localStorage.clear();
   }

   removeToken() {
      localStorage.removeItem('token');
   }
}
