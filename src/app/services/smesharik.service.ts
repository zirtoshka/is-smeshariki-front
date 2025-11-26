import {inject, Injectable} from '@angular/core';
import {BaseService} from '../base/base.service';
import {Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';
import {Friend} from '../model/friend';
import {AuthFacade} from '../auth-tools/auth.facade';

@Injectable({
  providedIn: 'root'
})
export class SmesharikService {

  private baseService = inject(BaseService);
  private authFacade = inject(AuthFacade);


  getFriends(options: Partial<{
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
    nameOrLogin: string;
  }> = {}): Observable<PaginatedResponse<Friend>> {
    const defaultOptions = {
      page: 0,
      size: 2,
      nameOrLogin: this.authFacade.login ?? undefined
    };

    const params = {...defaultOptions, ...options};

    return this.baseService.getItems("friend", params);
  }
  getApplicationFriends(options: Partial<{
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
    nameOrLogin: string;
  }> = {}): Observable<PaginatedResponse<Friend>> {
    const defaultOptions = {
      page: 0,
      size: 2,
      nameOrLogin: this.authFacade.login ?? undefined
    };

    const params = {...defaultOptions, ...options};

    return this.baseService.getItems("friend/follows", params);
  }

  getFollowers(options: Partial<{
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
    nameOrLogin: string;
  }> = {}): Observable<PaginatedResponse<Friend>> {
    const defaultOptions = {
      page: 0,
      size: 2,
      nameOrLogin: this.authFacade.login ?? undefined
    };

    const params = {...defaultOptions, ...options};

    return this.baseService.getItems("friend/followers", params);
  }

  deleteFriend(options: Partial<{
    follower: string,
    followee: string,
  }>) {
    const defaultOptions = {
      followee: this.authFacade.login ?? undefined
    }
    const params = {...defaultOptions, ...options};

    return this.baseService.deleteWithParams("friend", params);
  }

  acceptFriend(options: Partial<{
    follower: string,
    followee: string,
  }>){
    const defaultOptions = {
      followee: this.authFacade.login ?? undefined
    }
    const params = {...defaultOptions, ...options};

    return this.baseService.postWithParams("friend/acceptFriend", params);
  }

  getSmeshariks(options: Partial<{
    roles: string;
    ascending: boolean;
    page: number;
    size: number;
    nameOrLogin: string;
  }> = {}): Observable<PaginatedResponse<Friend>> {
    const defaultOptions = {
      page: 0,
      size: 2,
    };

    const params = {...defaultOptions, ...options};

    return this.baseService.getItems("smesharik", params);
  }


  makeReqFriend(options: Partial<{
    follower: string,
    followee: string,
  }>){
    const defaultOptions = {
      follower: this.authFacade.login ?? undefined
    }
    const params = {...defaultOptions, ...options};

    return this.baseService.createItem("friend", params);
  }

  makeAdmin( login:string){
    return this.changeRole("ADMIN", login);
  }


  makeDoctor( login:string) {
    return this.changeRole("DOCTOR", login);
  }
  makeUser( login:string) {
    return this.changeRole("USER", login);
  }
  changeRole(role: string, login:string){
    return this.baseService.createItem(`smesharik/${login}/changeRole`, {role:role});
  }
}
