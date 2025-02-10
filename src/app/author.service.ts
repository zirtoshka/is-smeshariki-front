import {inject, Injectable} from '@angular/core';
import {Smesharik} from './auth-tools/smesharik';
import {HttpClient} from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';
import {UserService} from './services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private authorsMap = new Map<string, Smesharik>();


  protected userService = inject(UserService);


  getSmesharikByLogin(login: string): Observable<Smesharik> {
    if (this.authorsMap.has(login)) {
      return of(this.authorsMap.get(login)!);
    }

    return this.userService.getSmesharikByLogin(login).pipe(
      tap(author => this.authorsMap.set(login, author))
    );
  }
}
