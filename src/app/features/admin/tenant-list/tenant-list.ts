import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { JrTenantResponse } from '../../../api-services/models/jr-tenant-response';
import { JrPageResponseJrTenantResponse } from '../../../api-services/models/jr-page-response-jr-tenant-response';
import { TenantService } from '../../../api-services/services/tenant.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
   selector: 'app-tenant-list',
   imports: [
      TableModule,
      Toast
   ],
   providers: [MessageService],
   templateUrl: './tenant-list.html',
   styleUrl: './tenant-list.scss'
})
export class TenantList implements OnInit {
   private readonly tenantService = inject(TenantService);
   private readonly messageService = inject(MessageService);

   protected tenants: JrTenantResponse[] = [];
   private tenantPage: JrPageResponseJrTenantResponse = {};

   ngOnInit(): void {
      this.loadTenants();
   }

   private loadTenants() {
      this.tenantService.findAll({ page: 0, size: 10 }).subscribe({
         next: (response) => {
            // this.tenantPage = response;
            this.tenants = response.content || [];
         },
         error: (error) => {
            this.messageService.add({
               severity: 'error',
               summary: 'Error',
               detail: 'Failed to load tenants'
            });
         }
      });
   }
}
