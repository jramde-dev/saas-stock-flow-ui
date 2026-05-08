import {Component, inject} from '@angular/core';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {JrErrorResponse, JrValidationError} from '../../../../shared/models/jr-error-response';
import {JrCategoryRequest} from '../../../../api-services/models/jr-category-request';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {CategoryService} from '../../../../api-services/services/category.service';

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
export class ManageCategory {
  private readonly messageService = inject(MessageService);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private validationErrors: Array<JrValidationError> = [];

  protected categoryRequest: JrCategoryRequest = { name: '', description: '' };


  protected hasError(fieldName: string): boolean {
    return this.validationErrors.some((errResp) => errResp.field === fieldName);
  }

  protected getErrorMsg(fieldName: string): string {
    return this.validationErrors.find((err) => err.field == fieldName)?.message || '';
  }

  protected onAdd() {
    this.categoryService.create3({ body: this.categoryRequest }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'New category added successfully.'
        });
        this.onCancel();
      },
      error: (err) => {
        const errorResp = JSON.parse(err.error) as JrErrorResponse;
        this.validationErrors = errorResp.validationErrors || [];
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create category.'
        });
      }
    });
  }

  protected onCancel() {
    void this.router.navigate(['app', 'categories']);
  }
}
