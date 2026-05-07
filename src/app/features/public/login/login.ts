import { Component, inject } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { JrLoginRequest } from '../../../api-services/models/jr-login-request';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../api-services/services/authentication.service';
import { JrErrorResponse, JrValidationError } from '../../../models/jr-error-response';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { TokenService } from '../../../core/services/token-service';
import { Router } from '@angular/router';

@Component({
   selector: 'app-login',
   imports: [FloatLabelModule, InputTextModule, ButtonModule, FormsModule, Toast],
   providers: [MessageService],
   templateUrl: './login.html',
   styleUrl: './login.scss'
})
export class Login {
   private readonly authService = inject(AuthenticationService);
   private readonly messageService = inject(MessageService);
   private readonly tokenService = inject(TokenService);
   private readonly router = inject(Router);
   private validationErrors: Array<JrValidationError> = [];

   loginRequest: JrLoginRequest = { username: '', password: '' };

   protected onLogin() {
      this.authService.login({ body: this.loginRequest }).subscribe({
         next: (response) => {
            this.tokenService.setToken(response);
            this.navigateUser();
         },
         error: (err) => {
            const errorResp = err.error as JrErrorResponse;
            this.validationErrors = errorResp.validationErrors || [];
            this.messageService.add({
               severity: 'error',
               summary: 'Error',
               detail: 'Username or password are incorrect.'
            });
         }
      });
   }

   protected onRegister() {
      this.router.navigate(['register']);
   }

   protected hasError(fieldName: string): boolean {
      return this.validationErrors.some((errResp) => errResp.field === fieldName);
   }

   protected getErrorMsg(fieldName: string): string {
      return this.validationErrors.find((err) => err.field == fieldName)?.message || '';
   }

   private navigateUser() {
      if (this.tokenService.isPlatformAdmin) {
         this.router.navigate(['administration']);
      } else if (this.tokenService.isCompanyAdmin
         || this.tokenService.isAdministrator
         || this.tokenService.isSalesOperator
         || this.tokenService.isUser) {
         this.router.navigate(['app']);
      }
   }
}
