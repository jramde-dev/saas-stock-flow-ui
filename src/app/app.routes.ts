import {Routes} from '@angular/router';
import {Home} from './features/public/home/home';
import {authGuard} from './core/guards/auth/auth-guard';
import {platformAdminGuard} from './core/guards/platform-admin/platform-admin-guard';
import {tenantCheckerGuard} from './core/guards/tenant/tenant-checker-guard';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home' },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./features/public/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    title: 'Registration',
    loadComponent: () => import('./features/public/register/register').then(m => m.Register)
  },
  {
    path: 'administration',
    title: 'Manage Tenants',
    canActivate: [authGuard, platformAdminGuard],
    loadComponent: () => import('./features/admin/tenant-list/tenant-list').then(m => m.TenantList)
  },

  // Tenants features management
  {
    path: 'app',
    canActivate: [authGuard, tenantCheckerGuard],
    loadComponent: () => import('./features/tenant/dashboard/dashboard').then(m => m.Dashboard),
    children: [
      {
        path: 'categories',
        title: 'Manage Categories',
        loadComponent: () => import('./features/tenant/category-list/category-list')
          .then(m => m.CategoryList)
      },
      {
        path: 'manage-category',
        loadComponent: () => import('./features/tenant/category-list/manage-category/manage-category')
          .then(m => m.ManageCategory)
      },
      {
        path: 'manage-category/:categoryId',
        loadComponent: () => import('./features/tenant/category-list/manage-category/manage-category')
          .then(m => m.ManageCategory)
      },
      {
        path: 'products',
        title: 'Manage Products',
        loadComponent: () => import('./features/tenant/product-list/product-list')
          .then(m => m.ProductList)
      },
      {
        path: 'manage-product',
        loadComponent: () => import('./features/tenant/product-list/manage-product/manage-product')
          .then(m => m.ManageProduct)
      },
      {
        path: 'manage-product/:productId',
        loadComponent: () => import('./features/tenant/product-list/manage-product/manage-product')
          .then(m => m.ManageProduct)
      },
      {
        path: 'stocks-movements',
        title: 'Manage Movements',
        loadComponent: () => import('./features/tenant/stock-mvmt/stock-mvmt')
          .then(m => m.StockMvmt)
      },
      {
        path: 'manage-movement',
        loadComponent: () => import('./features/tenant/stock-mvmt/manage-stock-mvmt/manage-stock-mvmt')
          .then(m => m.ManageStockMvmt)
      },
      {
        path: 'manage-movement/:movementId',
        loadComponent: () => import('./features/tenant/stock-mvmt/manage-stock-mvmt/manage-stock-mvmt')
          .then(m => m.ManageStockMvmt)
      },
      {
        path: 'users',
        title: 'Users',
        loadComponent: () => import('./features/tenant/user-list/user-list')
          .then(m => m.UserList)
      },
      {
        path: 'manage-user',
        title: 'Manage Users',
        loadComponent: () => import('./features/tenant/user-list/manage-user/manage-user')
          .then(m => m.ManageUser)
      },
      {
        path: 'manage-user/:userId',
        title: 'Manage User',
        loadComponent: () => import('./features/tenant/user-list/manage-user/manage-user')
          .then(m => m.ManageUser)
      }
    ]
  }
];
