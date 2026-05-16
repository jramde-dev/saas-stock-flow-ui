import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { ProductService } from '../../../api-services/services/product.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { JrProductResponse } from '../../../api-services/models/jr-product-response';
import { JrPageResponseJrProductResponse } from '../../../api-services/models/jr-page-response-jr-product-response';
import { JrStockMvmtResponse } from '../../../api-services/models/jr-stock-mvmt-response';
import {
  JrPageResponseJrStockMvmtResponse
} from '../../../api-services/models/jr-page-response-jr-stock-mvmt-response';
import { MovementService } from '../../../api-services/services/movement.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { JrStockMvmtRequest } from '../../../api-services/models/jr-stock-mvmt-request';
import { JrErrorResponse, JrValidationError } from '../../../shared/models/jr-error-response';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Tooltip } from 'primeng/tooltip';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-stock-mvmt',
  imports: [
    Button, TableModule, Toast, DialogModule,
    InputTextModule, FormsModule, SelectModule, Tooltip, DatePipe
  ],
  providers: [MessageService],
  templateUrl: './stock-mvmt.html',
  styleUrl: './stock-mvmt.scss'
})
export class StockMvmt implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly stockMvtService = inject(MovementService);
  private readonly messageService = inject(MessageService);
  private readonly changeDetectionRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  protected products: JrProductResponse[] = [];
  protected stockMvmts: JrStockMvmtResponse[] = [];
  private productPage: JrPageResponseJrProductResponse = {};
  private stockMvtPage: JrPageResponseJrStockMvmtResponse = {};
  protected selectedProduct: JrProductResponse | null = {}; // or null
  protected visible: boolean = false;
  protected stockMvtRequest: JrStockMvmtRequest = {
    typeMvmt: 'IN',
    productId: '',
    dateMvmt: '',
    comment: '',
    quantity: undefined
  };
  protected typeMvmt: string[] = ['IN', 'OUT'];
  protected selectedType: any = 'IN';
  private validationErrors: Array<JrValidationError> = [];
  private stockMvmtId: string | null = null;

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts() {
    this.productService.findAll2({ page: 0, size: 10 }).subscribe({
      next: (response) => {
        this.products = response.content || [];
        this.changeDetectionRef.detectChanges();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load products'
        });
      }
    });
  }

  protected loadStockMvtByProduct(product: JrProductResponse): void {
    this.selectedProduct = product;
    if (this.selectedProduct) {
      this.stockMvtService.findAllByProductId({ productId: product.id as string, page: 0, size: 10 })
        .subscribe({
          next: (response) => {
            this.stockMvtPage = response;
            this.stockMvmts = [...(response.content || [])];
            this.changeDetectionRef.detectChanges();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to load stock movements for the selected product.'
            });
            this.changeDetectionRef.detectChanges();
          }
        });
    }
  }

  protected onAddNewProduct(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Information',
      detail: 'Method not implemented yet.'
    });
  }

  protected onCreateMovement() {
    this.visible = true;
  }

  protected hasError(fieldName: string): boolean {
    return this.validationErrors.some((errResp) => errResp.field === fieldName);
  }

  protected getErrorMsg(fieldName: string): string {
    return this.validationErrors.find((err) => err.field == fieldName)?.message || '';
  }

  protected onSaveStockMvmt() {
    if (this.stockMvmtId) {
      this.updateStockMvmt();
    } else {
      this.createStockMvmt();
    }
  }

  protected onEditStockMvmt(movement: JrStockMvmtResponse) {
    this.stockMvtRequest = {
      productId: this.selectedProduct?.id as string,
      comment: movement.comment,
      // dateMvmt: movement.dateMvmt,
      quantity: movement.quantity,
      typeMvmt: movement.typeMvmt as 'IN' | 'OUT'
    };
    this.stockMvmtId = movement.id as string;
    this.visible = true;
  }

  protected onDeleteStockMvmt(mvmtId: string) {
    this.selectedProduct;
    this.stockMvtService.delete1({ mvmtId: mvmtId }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Stock movement deleted successfully.'
        });
        this.loadStockMvtByProduct(this.selectedProduct as JrProductResponse);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete product.'
        });
      }
    });
  }

  private createStockMvmt(): void {
    this.stockMvtRequest.typeMvmt = this.selectedType;
    this.stockMvtRequest.productId = this.selectedProduct?.id as string;
    this.stockMvtService.create1({ body: this.stockMvtRequest }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Stock movement created successfully.'
        });
        this.visible = false;
        this.loadStockMvtByProduct(this.selectedProduct as JrProductResponse);
        this.stockMvtRequest = {
          comment: undefined,
          dateMvmt: undefined,
          productId: '',
          quantity: undefined,
          typeMvmt: 'OUT'
        };
      },
      error: (err) => {
        const errorResp = JSON.parse(err.error) as JrErrorResponse;
        this.validationErrors = errorResp.validationErrors || [];
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Fail to create stock movement.'
        });
        this.changeDetectionRef.detectChanges();
      }
    });
  }

  private updateStockMvmt(): void {
    this.stockMvtRequest.typeMvmt = this.selectedType;
    this.stockMvtRequest.productId = this.selectedProduct?.id as string;
    this.stockMvtService.update1({
      mvmtId: this.stockMvmtId as string,
      body: this.stockMvtRequest
    }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Stock movement updated successfully.'
        });
        this.visible = false;
        this.stockMvtRequest = {
          comment: undefined,
          dateMvmt: undefined,
          productId: '',
          quantity: undefined,
          typeMvmt: 'OUT'
        };
        this.loadStockMvtByProduct(this.selectedProduct as JrProductResponse);
      },
      error: (err) => {
        const errorResp = JSON.parse(err.error) as JrErrorResponse;
        this.validationErrors = errorResp.validationErrors || [];
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Fail to update stock movement.'
        });
        this.changeDetectionRef.detectChanges();
      }
    });
  }
}
