import {inject, Injectable} from '@angular/core';
import {UserDataService} from '../data-access/user-data.service';
import {Smesharik} from '../auth-tools/smesharik';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserFacade {
  private readonly dataService = inject(UserDataService);

  editSmesharik(login: string, body: any): Observable<Smesharik> {
    return this.dataService.editSmesharik(login, body);
  }

  getSmesharikByLogin(login: string): Observable<Smesharik> {
    return this.dataService.getSmesharikByLogin(login);
  }

  changePassword(login: string, oldPassword: string, newPassword: string): Observable<void> {
    return this.dataService.changePassword(login, oldPassword, newPassword);
  }
}
