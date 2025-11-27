import {inject, Injectable} from '@angular/core';
import {SmesharikDataService} from '../data-access/smesharik-data.service';
import {Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';
import {Friend} from '../model/friend';

@Injectable({
  providedIn: 'root'
})
export class SmesharikFacade {
  private readonly dataService = inject(SmesharikDataService);

  getFriends(options?: Partial<{ sortField: string; ascending: boolean; page: number; size: number; nameOrLogin: string; }>): Observable<PaginatedResponse<Friend>> {
    return this.dataService.getFriends(options);
  }

  getApplicationFriends(options?: Partial<{ sortField: string; ascending: boolean; page: number; size: number; nameOrLogin: string; }>): Observable<PaginatedResponse<Friend>> {
    return this.dataService.getApplicationFriends(options);
  }

  getFollowers(options?: Partial<{ sortField: string; ascending: boolean; page: number; size: number; nameOrLogin: string; }>): Observable<PaginatedResponse<Friend>> {
    return this.dataService.getFollowers(options);
  }

  deleteFriend(options: Partial<{ follower: string; followee: string; }>) {
    return this.dataService.deleteFriend(options);
  }

  acceptFriend(options: Partial<{ follower: string; followee: string; }>) {
    return this.dataService.acceptFriend(options);
  }

  getSmeshariks(options?: Partial<{ roles: string; ascending: boolean; page: number; size: number; nameOrLogin: string; }>): Observable<PaginatedResponse<Friend>> {
    return this.dataService.getSmeshariks(options);
  }

  makeReqFriend(options: Partial<{ follower: string; followee: string; }>) {
    return this.dataService.makeReqFriend(options);
  }

  makeAdmin(login: string) {
    return this.dataService.makeAdmin(login);
  }

  makeDoctor(login: string) {
    return this.dataService.makeDoctor(login);
  }

  makeUser(login: string) {
    return this.dataService.makeUser(login);
  }
}
