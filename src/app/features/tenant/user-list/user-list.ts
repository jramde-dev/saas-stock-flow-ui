import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { UserService } from '../../../api-services/services/user.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { JrUserResponse } from '../../../api-services/models/jr-user-response';
import { JrPageResponseJrUserResponse } from '../../../api-services/models/jr-page-response-jr-user-response';

@Component({
  selector: 'app-user-list',
  imports: [ButtonModule, PanelModule, TableModule, ToastModule, TooltipModule],
  providers: [MessageService],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList implements OnInit {
  protected users: JrUserResponse[] = [];
  private readonly userService = inject(UserService);
  private readonly messageService = inject(MessageService);
  private readonly changeDetectionRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private userPage: JrPageResponseJrUserResponse = {};

  ngOnInit(): void {
    this.loadUsers();
  }

  protected onDeleteUser(userId: string) {
    this.userService.delete({ userId: userId }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully.'
        });
        this.loadUsers();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete user.'
        });
      }
    });
  }

  protected onAddUser() {
    void this.router.navigate(['app', 'manage-user']);
  }

  protected onEditUser(userId: string) {
    void this.router.navigate(['app', 'manage-user', userId]);
  }

  private loadUsers() {
    this.userService.findAll({ page: 0, size: 10 }).subscribe({
      next: (response) => {
        this.users = response.content || [];
        this.changeDetectionRef.detectChanges();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
      }
    });
  }
}
