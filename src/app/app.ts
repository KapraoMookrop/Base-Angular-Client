import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { UserRole, UserStatus } from './types/Enum';
import { AppStateService } from './core/AppStateService';
import { AuthService } from './core/AuthService';
import { filter } from 'rxjs';
import { UserClientData } from './types/UserClientData';
import { jwtDecode } from 'jwt-decode';
import { Navbar } from './component/navbar/navber';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Base-Angular-Client');
  token?: string;

  constructor(public authService: AuthService, public stateService: AppStateService, public router: Router) { }

  showNavbarRoutes = ['/home', '/chat', '/tracking', '/profile'];

  shouldShowNavbar() {
    return this.showNavbarRoutes.includes(this.router.url);
  }

  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      const url = event.urlAfterRedirects;

      if (url.startsWith('/verify-email')) {
        return;
      }

      this.loadUserFromToken();

    });
  }

  loadUserFromToken() {
    this.token = localStorage.getItem('token') || undefined;

    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const decodeJwt = jwtDecode<JwtPayload>(this.token);

      const userClient: UserClientData = {
        Email: decodeJwt.email,
        FullName: decodeJwt.fullName,
        Role: decodeJwt.role,
        Phone: decodeJwt.phone,
        UserStatus: decodeJwt.userStatus,
        IsEnabled2FA: decodeJwt.isEnabled2FA
      };

      this.authService.SetUserClient(this.token, userClient, decodeJwt.userId);

    } catch (err) {
      console.error('Invalid token', err);
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }
}


interface JwtPayload {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone: string;
  userStatus: UserStatus;
  isEnabled2FA: boolean;
}