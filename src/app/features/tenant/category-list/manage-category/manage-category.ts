import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { JrErrorResponse, JrValidationError } from '../../../../shared/models/jr-error-response';
import { JrCategoryRequest } from '../../../../api-services/models/jr-category-request';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { CategoryService } from '../../../../api-services/services/category.service';

@Component({
  selector: 'app-manage-category',
  imports: [
    FloatLabel,
    InputText,
    FormsModule,
    Button
  ],
  providers: [MessageService],
  templateUrl: './manage-category.html',
  styleUrl: './manage-category.scss'
})
export class ManageCategory implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly categoryService = inject(CategoryService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly changeDetectionRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private validationErrors: Array<JrValidationError> = [];
  protected categoryRequest: JrCategoryRequest = { name: '', description: '' };
  protected categoryId!: string;


  ngOnInit(): void {
    this.categoryId = this.activatedRoute.snapshot.params['categoryId'];
    this.loadCategoryById(this.categoryId);
  }

  /**
   * Récupère les détails d'une catégorie.
   */
  private loadCategoryById(categoryId: string) {
    this.categoryService.findById3({ categoryId: categoryId }).subscribe({
      next: (response) => {
        this.categoryRequest = {
          name: response.name || '',
          description: response.description || ''
        };
        this.changeDetectionRef.detectChanges();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load category.'
        });
      }
    });
  }

  /**
   * Ajoute une nouvelle catégorie.
   */
  protected onAddCategory() {
    if (this.categoryId) {
      this.updateCategory(this.categoryId);
    } else {
      this.createCategory();
    }
  }

  private updateCategory(categoryId: string) {
    this.categoryService.update3({
      categoryId: categoryId,
      body: this.categoryRequest
    }).subscribe({
      next: () => {
        this.backToCategories();
      },
      error: (err) => {
        const errorResp = JSON.parse(err.error) as JrErrorResponse;
        this.validationErrors = errorResp.validationErrors || [];
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to edit category.'
        });
      }
    });
  }

  private createCategory() {
    this.categoryService.create3({ body: this.categoryRequest }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'New category added successfully.'
        });
        this.backToCategories();
      },
      error: (err) => {
        const errorResp = JSON.parse(err.error) as JrErrorResponse;
        this.validationErrors = errorResp.validationErrors || [];
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create category.'
        });
        this.changeDetectionRef.detectChanges();
      }
    });
  }

  protected backToCategories() {
    void this.router.navigate(['app', 'categories']);
  }

  protected hasError(fieldName: string): boolean {
    return this.validationErrors.some((errResp) => errResp.field === fieldName);
  }

  protected getErrorMsg(fieldName: string): string {
    return this.validationErrors.find((err) => err.field == fieldName)?.message || '';
  }
}
