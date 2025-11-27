import {inject, Injectable} from '@angular/core';
import {Smesharik} from './auth-tools/smesharik';
import {Observable, of, tap} from 'rxjs';
import {UserFacade} from './facade/user.facade';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private authorsMap = new Map<string, Smesharik>();


  protected userFacade = inject(UserFacade);


  getSmesharikByLogin(login: string): Observable<Smesharik> {
    if (this.authorsMap.has(login)) {
      return of(this.authorsMap.get(login)!);
    }

    return this.userFacade.getSmesharikByLogin(login).pipe(
      tap(author => this.authorsMap.set(login, author))
    );
  }
}
