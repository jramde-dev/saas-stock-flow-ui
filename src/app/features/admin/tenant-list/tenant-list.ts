import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {JrTenantResponse} from '../../../api-services/models/jr-tenant-response';
import {JrPageResponseJrTenantResponse} from '../../../api-services/models/jr-page-response-jr-tenant-response';
import {TenantService} from '../../../api-services/services/tenant.service';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {Tooltip} from 'primeng/tooltip';
import {PanelModule} from 'primeng/panel';

@Component({
  selector: 'app-tenant-list',
  imports: [
    TableModule,
    Toast,
    Tooltip,
    PanelModule
  ],
  providers: [MessageService],
  templateUrl: './tenant-list.html',
  styleUrl: './tenant-list.scss'
})
export class TenantList implements OnInit {
  private readonly tenantService = inject(TenantService);
  private readonly messageService = inject(MessageService);
  private readonly changeDetectionRef = inject(ChangeDetectorRef);

  protected tenants: JrTenantResponse[] = [];
  private tenantPage: JrPageResponseJrTenantResponse = {};

  ngOnInit(): void {
    this.loadTenants();
  }

  private loadTenants() {
    this.tenantService.findAll4({ page: 0, size: 10 }).subscribe({
      next: (response) => {
        this.tenants = response.content || [];
        this.changeDetectionRef.detectChanges();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load tenants'
        });
      }
    });
  }

  protected approveTenant(tenantId: string): void {
    this.tenantService.approveTenant({ tenantId: tenantId }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tenant approved successfully !'
        });
        this.loadTenants();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to approve tenant.'
        });
      }
    });
  }

  protected suspendTenant(tenantId: string): void {
    this.tenantService.suspendTenant({ tenantId: tenantId }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tenant suspended successfully !'
        });
        this.loadTenants();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to suspend tenant.'
        });
      }
    });
  }

  protected deactivateTenant(tenantId: string): void {
    this.tenantService.deactivateTenant({ tenantId: tenantId }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tenant deactivated successfully !'
        });
        this.loadTenants();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to deactivate tenant.'
        });
      }
    });
  }

  protected activateTenant(tenantId: string): void {
    this.tenantService.activateTenant({ tenantId: tenantId }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tenant activated successfully !'
        });
        this.loadTenants();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to activate tenant.'
        });
      }
    });
  }
}
