import {Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [ButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly router = inject(Router);

  protected onLogin() {
    this.router.navigateByUrl("login")
  }

  protected onRegister() {
    this.router.navigate(["register"])
  }
}
