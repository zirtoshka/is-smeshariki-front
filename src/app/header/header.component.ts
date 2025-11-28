import {Component, CUSTOM_ELEMENTS_SCHEMA, inject} from '@angular/core';
import {Router, NavigationEnd, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {filter} from 'rxjs/operators';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {AuthService} from '../auth-tools/auth.service';
import {NzDropDownDirective, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {ThemeService} from '../services/theme.service';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NzMenuModule,
    NzLayoutModule,
    RouterOutlet,
    NzIconModule,
    NzDropDownDirective,
    NzDropdownMenuComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderComponent {
  activeRoute: string = '';
  private authService = inject(AuthService);
  protected themeService = inject(ThemeService);
  protected readonly theme$ = this.themeService.theme$;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.activeRoute = this.router.url; // текущий маршрут
    });
  }


  logOut() {
    this.authService.logOut();
  }
  isLoggedIn(){
    return this.authService.isLoggedIn
  }

  isAdmin(){
    return this.authService.isAdmin;
  }

  navigateToProfile(): void {
    if (!this.authService.currentLogin) {
      return;
    }
    this.router.navigate(['/smesharik', this.authService.currentLogin]);
  }

  isDoctor(){
    return this.authService.isDoctor;
  }
  change(value: boolean): void {
    console.log(value);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
