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

@Component({
  selector: 'app-stock-mvmt',
  imports: [Button, TableModule, Toast],
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
  protected stockMvts: JrStockMvmtResponse[] = [];
  private productPage: JrPageResponseJrProductResponse = {};
  private stockMvtPage: JrPageResponseJrStockMvmtResponse = {};

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

  private loadStockMvtByProductId(productId: string): void {
    this.stockMvtService.findAllByProductId({ productId: productId, page: 0, size: 10 })
      .subscribe({
        next: (response) => {
          this.stockMvtPage = response;
          this.stockMvts = [...(response.content || [])];
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

  protected onCreateMovements() {

  }
}
