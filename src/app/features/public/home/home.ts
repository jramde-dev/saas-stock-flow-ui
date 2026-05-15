import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
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
    void this.router.navigateByUrl("login")
  }

  protected onRegister() {
    void this.router.navigate(["register"])
  }
}
