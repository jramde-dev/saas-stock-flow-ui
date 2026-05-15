import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {RouterOutlet} from '@angular/router';
import {TokenService} from '../../../core/services/token-service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    Button,
    RouterOutlet
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard {
  private readonly tokenService = inject(TokenService);

  protected onLogout() {
    void this.tokenService.logout();
  }
}
