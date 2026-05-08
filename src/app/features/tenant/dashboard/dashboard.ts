import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';

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

  protected onNavigateTo(query: string) {
    if (query === 'cat') {
      void this.router.navigate(['app', 'categories']);
    } else if (query === 'pro') {
      void this.router.navigate(['app', 'products']);
    } else if (query === 'smv') {
      void this.router.navigate(['app', 'stocks-movements']);
    }
  }
}
