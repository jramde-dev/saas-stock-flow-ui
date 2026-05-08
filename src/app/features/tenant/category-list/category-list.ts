import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {Panel} from 'primeng/panel';
import {TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {Tooltip} from 'primeng/tooltip';
import {MessageService} from 'primeng/api';
import {CategoryService} from '../../../api-services/services';
import {JrPageResponseJrCategoryResponse} from '../../../api-services/models/jr-page-response-jr-category-response';
import {JrCategoryResponse} from '../../../api-services/models/jr-category-response';
import {Button} from 'primeng/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-category-list',
  imports: [
    Panel,
    TableModule,
    Toast,
    Tooltip,
    Button
  ],
  providers: [MessageService],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss'
})
export class CategoryList {
  private readonly categoryService = inject(CategoryService);
  private readonly messageService = inject(MessageService);
  private readonly changeDetectionRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  protected categories: JrCategoryResponse[] = [];
  private categoryPage: JrPageResponseJrCategoryResponse = {};

  ngOnInit(): void {
    this.loadCategories();
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

  protected onEditCategory(categoryId: string) {

  }

  protected onDeleteCategory() {

  }

  protected addCategory() {
    void this.router.navigate(['app', 'manage-category']);
  }
}
