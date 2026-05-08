import {Component, inject} from '@angular/core';
import {AuthenticationService} from '../../../api-services/services/authentication.service';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {JrErrorResponse, JrValidationError} from '../../../shared/models/jr-error-response';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Toast} from 'primeng/toast';
import {JrRegisterTenantRequest} from '../../../api-services/models/jr-register-tenant-request';
import {Divider} from 'primeng/divider';

@Component({
   selector: 'app-register',
   imports: [
      Button,
      FloatLabel,
      FormsModule,
      InputText,
      Toast,
      Divider
   ],
   providers: [MessageService],
   templateUrl: './register.html',
   styleUrl: './register.scss'
})
export class Register {
   private readonly authService = inject(AuthenticationService);
   private readonly messageService = inject(MessageService);
   private readonly router = inject(Router);
   private validationErrors: Array<JrValidationError> = [];

   registerRequest: JrRegisterTenantRequest = {
      adminEmail: '',
      adminFirstName: '',
      adminLastName: '',
      adminPassword: '',
      adminUsername: '',
      companyCode: '',
      companyEmail: '',
      companyName: ''
   };

   protected hasError(fieldName: string): boolean {
      return this.validationErrors.some((errResp) => errResp.field === fieldName);
   }

   protected getErrorMsg(fieldName: string): string {
      return this.validationErrors.find((err) => err.field == fieldName)?.message || '';
   }

   protected onRegister() {
      this.authService.register({ body: this.registerRequest }).subscribe({
         next: () => {
            this.messageService.add({
               severity: 'success',
               summary: 'Success',
               detail: 'Account created successfully. Please check your e-mail for verification.'
            });
            this.router.navigate(['']);
         },
         error: (err) => {
            const errorResp = JSON.parse(err.error) as JrErrorResponse;
            this.validationErrors = errorResp.validationErrors || [];
            this.messageService.add({
               severity: 'error',
               summary: 'Error',
               detail: 'Registration failed. Please check your input.'
            });
         }
      });
   }

   protected onLogin() {
      this.router.navigate(['login']);
   }
}
