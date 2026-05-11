import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { Panel } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';
import { ProductService } from '../../../api-services/services/product.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { JrProductResponse } from '../../../api-services/models/jr-product-response';
import { JrPageResponseJrProductResponse } from '../../../api-services/models/jr-page-response-jr-product-response';

@Component({
  selector: 'app-product-list',
  imports: [
    Button,
    Panel,
    TableModule,
    Toast,
    Tooltip
  ],
  providers: [MessageService],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly messageService = inject(MessageService);
  private readonly changeDetectionRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  protected products: JrProductResponse[] = [];
  private productPage: JrPageResponseJrProductResponse = {};

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

  protected onDeleteProduct(productId: string) {
    this.productService.delete2({ productId: productId }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product deleted successfully.'
        });
        this.loadProducts();
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

  protected onAddProduct() {
    void this.router.navigate(['app', 'manage-product']);
  }

  protected onEditProduct(productId: string) {
    void this.router.navigate(['app', 'manage-product', productId]);
  }
}
