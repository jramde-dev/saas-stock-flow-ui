import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../../api-services/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JrErrorResponse, JrValidationError } from '../../../../shared/models/jr-error-response';
import { JrProductRequest } from '../../../../api-services/models/jr-product-request';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { JrProductResponse } from '../../../../api-services/models/jr-product-response';
import { SelectModule } from 'primeng/select';
import { JrCategoryResponse } from '../../../../api-services/models/jr-category-response';
import { CategoryService } from '../../../../api-services/services/category.service';

@Component({
  selector: 'app-manage-product',
  imports: [
    Button,
    FloatLabel,
    InputText,
    FormsModule,
    SelectModule
  ],
  providers: [MessageService],
  templateUrl: './manage-product.html',
  styleUrl: './manage-product.scss'
})
export class ManageProduct implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly changeDetectionRef = inject(ChangeDetectorRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private validationErrors: Array<JrValidationError> = [];
  protected productRequest: JrProductRequest = {
    categoryId: '',
    name: '',
    description: '',
    reference: '',
    price: 0,
    alertThreshold: undefined
  };
  private productId!: string;
  protected categories: JrCategoryResponse[] = [];
  protected selectedCategory: JrCategoryResponse | null = null;

  ngOnInit(): void {
    this.loadCategories();
    this.productId = this.activatedRoute.snapshot.params['productId'];
    if (this.productId) {
      this.loadProductById(this.productId);
    }
  }

  private loadCategories() {
    this.categoryService.findAll3({ page: 0, size: 10 }).subscribe({
      next: (response) => {
        this.categories = response.content || [];
        this.changeDetectionRef.detectChanges();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load categories'
        });
      }
    });
  }

  private loadProductById(productId: string) {
    this.productService.findById2({ productId: productId }).subscribe({
      next: (response) => {
        this.productRequest = this.toProductRequest(response);
        this.changeDetectionRef.detectChanges();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load product.'
        });
      }
    });
  }

  /**
   * Map the product response to a product request.
   * @param response : product response
   */
  private toProductRequest(response: JrProductResponse) {
    return {
      alertThreshold: response.alertThreshold!,
      description: response.description!,
      categoryId: response.categoryId!,
      name: response.name!,
      price: response.price!,
      reference: response.reference!

    };
  }

  protected onAddProduct() {
    if (this.productId) {
      this.updateProduct(this.productId);
    } else {
      this.createProduct();
    }
  }

  private updateProduct(productId: string) {
    // this.productRequest.categoryId = this.selectedCategory?.id || '';
    this.productService.update2({
      productId: productId,
      body: this.productRequest
    }).subscribe({
      next: () => {
        this.backToProducts();
      },
      error: (err) => {
        const errorResp = JSON.parse(err.error) as JrErrorResponse;
        this.validationErrors = errorResp.validationErrors || [];
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to edit product.'
        });
      }
    });
  }

  private createProduct() {
    this.productRequest.categoryId = this.selectedCategory?.id || '';
    this.productService.create2({ body: this.productRequest }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'New product added successfully.'
        });
        this.backToProducts();
      },
      error: (err) => {
        const errorResp = JSON.parse(err.error) as JrErrorResponse;
        this.validationErrors = errorResp.validationErrors || [];
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create product.'
        });
      }
    });
  }

  protected backToProducts() {
    void this.router.navigate(['app', 'products']);
  }

  protected hasError(fieldName: string): boolean {
    return this.validationErrors.some((errResp) => errResp.field === fieldName);
  }

  protected getErrorMsg(fieldName: string): string {
    return this.validationErrors.find((err) => err.field == fieldName)?.message || '';
  }
}
