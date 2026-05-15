import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {UserService} from '../../../../api-services/services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {JrErrorResponse, JrValidationError} from '../../../../shared/models/jr-error-response';
import {ButtonModule} from 'primeng/button';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {SelectModule} from 'primeng/select';
import {JrUserRequest} from '../../../../api-services/models/jr-user-request';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-manage-user',
  imports: [
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    SelectModule,
    FormsModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './manage-user.html',
  styleUrl: './manage-user.scss'
})
export class ManageUser implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly userService = inject(UserService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly changeDetectionRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private validationErrors: Array<JrValidationError> = [];
  protected userRequest: JrUserRequest = {
    email: '', firstName: '', lastName: '', password: '',
    role: 'ROLE_USER', username: ''
  };
  private userId!: string;
  protected roles: string[] = [
    'ROLE_PLATFORM_ADMIN',
    'ROLE_COMPANY_ADMIN',
    'ROLE_ADMINISTRATOR',
    'ROLE_SALES_OPERATOR',
    'ROLE_USER'
  ];
  protected selectedRole:
    'ROLE_PLATFORM_ADMIN'
    | 'ROLE_COMPANY_ADMIN'
    | 'ROLE_ADMINISTRATOR'
    | 'ROLE_SALES_OPERATOR'
    | 'ROLE_USER' = 'ROLE_USER';


  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.params['userId'];
    if (this.userId) {
      this.loadUserById(this.userId);
    }
  }

  private loadUserById(userId: string) {
    this.userService.findById({ userId: userId }).subscribe({
      next: (response) => {
        this.userRequest = {
          email: response.email || '',
          firstName: response.firstName || '',
          lastName: response.lastName || '',
          password: '',
          username: response.username || '',
          role: response.role as 'ROLE_PLATFORM_ADMIN' | 'ROLE_COMPANY_ADMIN'
            | 'ROLE_ADMINISTRATOR' | 'ROLE_SALES_OPERATOR' | 'ROLE_USER'
        };
        this.changeDetectionRef.detectChanges();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user.'
        });
        this.changeDetectionRef.detectChanges();
      }
    });
  }

  protected onAddUser() {
    this.userRequest.role = this.selectedRole;
    if (this.userId) {
      this.updateUser(this.userId);
    } else {
      this.createUser();
    }
  }

  private updateUser(userId: string) {
    this.userService.update({
      userId: userId,
      body: this.userRequest
    }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User information successfully updated.'
        });
        this.backToUsers();
      },
      error: (err) => {
        const errorResp = JSON.parse(err.error) as JrErrorResponse;
        this.validationErrors = errorResp.validationErrors || [];
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to edit user.',
        });
        this.changeDetectionRef.detectChanges();
      }
    });
  }

  private createUser() {
    this.userService.create({ body: this.userRequest }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'New user added successfully.'
        });
        this.backToUsers();
      },
      error: (err) => {
        const errorResp = JSON.parse(err.error) as JrErrorResponse;
        this.validationErrors = errorResp.validationErrors || [];
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create user.'
        });
        this.changeDetectionRef.detectChanges();
      }
    });
  }

  protected backToUsers() {
    void this.router.navigate(['app', 'users']);
  }

  protected hasError(fieldName: string): boolean {
    return this.validationErrors.some((errResp) => errResp.field === fieldName);
  }

  protected getErrorMsg(fieldName: string): string {
    return this.validationErrors.find((err) => err.field == fieldName)?.message || '';
  }
}
