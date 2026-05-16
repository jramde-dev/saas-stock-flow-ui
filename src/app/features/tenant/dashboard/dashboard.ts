import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { TokenService } from '../../../core/services/token-service';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    Button
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);

  protected onNavigateTo(query: string) {
    if (query === 'cat') {
      void this.router.navigate(['app', 'categories']);
    } else if (query === 'pro') {
      void this.router.navigate(['app', 'products']);
    } else if (query === 'smv') {
      void this.router.navigate(['app', 'stocks-movements']);
    } else if (query === 'users') {
      void this.router.navigate(['app', 'users']);
    } else if (query === 'dash') { // Dashboard
      void this.router.navigate(['app']);
    }
  }

  protected onLogout() {
    void this.tokenService.logout();
  }
}
