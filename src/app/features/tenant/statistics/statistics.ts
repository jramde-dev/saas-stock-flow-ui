import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  imports: [],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss'
})
export class Statistics {
  private readonly router = inject(Router);

  protected navigateTo(c: string) {
    if (c === 'p') {
      void this.router.navigate(['app', 'products']);
    } else if (c === 'c') {
      void this.router.navigate(['app', 'categories']);
    } else if (c === 's') {
      void this.router.navigate(['app', 'stocks-movements']);
    } else if (c === 'u') {
      void this.router.navigate(['app', 'users']);
    }
  }
}
