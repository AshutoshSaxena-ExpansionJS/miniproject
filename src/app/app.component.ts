import { Component, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

//import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'miniproject';

  @ViewChild('logoutConfirmationTemplate') logoutConfirmationTemplate!: TemplateRef<any>;

  constructor(private router: Router, private dialog: MatDialog) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  openLogoutConfirmation(): void {
    this.dialog.open(this.logoutConfirmationTemplate);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }
}
