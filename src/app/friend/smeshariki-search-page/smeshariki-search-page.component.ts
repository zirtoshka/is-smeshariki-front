import {Component, inject, OnInit} from '@angular/core';
import {Context, FriendCardComponent} from '../friend-card/friend-card.component';
import {NgForOf, NgIf} from '@angular/common';
import {SearchFilterComponent} from '../../search-filter/search-filter.component';
import {BasePage} from '../../base/base-page';
import {Friend} from '../../model/friend';
import {SmesharikService} from '../../services/smesharik.service';
import {enumListToString, GeneralStatus} from '../../model/enums';
import {Roles} from '../../auth-tools/smesharik';
import {forkJoin, map, of, switchMap} from 'rxjs';

@Component({
  selector: 'app-smeshariki-search-page',
  standalone: true,
  imports: [
    FriendCardComponent,
    NgForOf,
    NgIf,
    SearchFilterComponent,
  ],
  templateUrl: './smeshariki-search-page.component.html',
  styleUrl: './smeshariki-search-page.component.css'
})
export class SmesharikiSearchPageComponent extends BasePage<Friend> implements OnInit {
  override action = "smesharik"

  smesharikService: SmesharikService = inject(SmesharikService);

  override selectedStatuses: Roles[] = [];


  override preparing(item: any): any {
    return new Friend(item).toBackendJson();
  }

  ngOnInit(): void {
    this.fetchDataFromServer()
  }

  override fetchDataFromServer(replacementIsNeeded: boolean = false) {
    this.smesharikService.getSmeshariks(
      {
        page: this.page,
        size: 4,
        nameOrLogin: this.searchQuery,
        roles: enumListToString(Roles, this.selectedStatuses) ?? "",
      })
      .subscribe({
        next: (response) => {
          const newItems = response.content.map(data => Friend.fromBackend(data));
          this.fetchHelper(newItems, replacementIsNeeded)
        },
        error: (err: any) => {
          console.error('Ошибка при загрузке:', err);
          this.notificationCustomService.handleErrorAsync(err, 'Держите меня, я падаю…');
        }
      });
  }

  override fetchHelper(newItems: Friend[], replacementIsNeeded: boolean = false) {
    if (replacementIsNeeded) {
      this.items = []
    }

    const uniqueNewItems = newItems.filter(
      (newItem) => !this.items.some((existingItem) => existingItem === newItem)
    );
    if (uniqueNewItems.length) {

      const checkIfFriend = uniqueNewItems.map(item =>
        this.smesharikService.getFriends({nameOrLogin: item.login}).pipe(
          switchMap(resp => {
            if (resp.totalElements === 1) {
              return of({...item, isMyFriend: true} as Friend);
            } else {
              return this.smesharikService.getApplicationFriends({nameOrLogin: item.login}).pipe(
                switchMap(resp => {
                  if (resp.totalElements === 1) {
                    return of({...item, isIFollow: true} as Friend);
                  } else {
                    return this.smesharikService.getFollowers({nameOrLogin: item.login}).pipe(
                      map(appResp => ({...item, isMyFollower: appResp.totalElements === 1} as Friend)))

                  }
                })
              );
            }
          })
        )
      );


      forkJoin(checkIfFriend).subscribe(updatedItems => {
        this.items.push(...updatedItems);
        this.page++;
        this.loading = false;
      });

    }
    if (newItems.length == 0) {
      this.allLoaded = true;
    }
    this.loading = false;

  }

  trackByLogin(index: number, friend: Friend) {
    return friend.login;
  }

  handleMakeFriend(friend: Friend): void {
    console.log('за]вка handleMakeFriend:', friend);
    this.smesharikService.makeReqFriend({followee: friend.login})
      .then((response: any) => {
        this.notificationCustomService.handleSuccess(
          "Туки-туки!", `заявка в друзья полетела к смешарику с логином ${friend.login}`
        );
      })
      .catch((err: any) => {
        console.error('Ошибка при загрузке:', err);
        this.notificationCustomService.handleErrorAsync(err, 'Держите меня, я падаю…');
      });

  }


  handleMakeAdmin(friend: Friend): void {
    console.log('за]вка handleMakeAdmin:', friend);
    this.smesharikService.makeAdmin(friend.login)
      .then((response: any) => {

        this.items = this.items.map(item =>
          item.login === friend.login ? {...item, role: Roles.ADMIN} as Friend : item
        );

        this.notificationCustomService.handleSuccess(
          "Зови меня Хозяин – не ошибёшься!",
          `смешарик с логином ${friend.login} теперь админ`
        );
      })
      .catch((err: any) => {
        console.error('Ошибка при загрузке:', err);
        this.notificationCustomService.handleErrorAsync(err, 'Держите меня, я падаю…');
      });
  }

  handleMakeDoctor(friend: Friend): void {
    console.log('за]вка handleMakeDoctor:', friend);
    this.smesharikService.makeDoctor(friend.login)
      .then((response: any) => {
        this.items = this.items.map(item =>
          item.login === friend.login ? {...item, role: Roles.DOCTOR} as Friend : item
        );
        this.notificationCustomService.handleSuccess(
          "Без болезни и здоровью не рад",
          `смешарик с логином ${friend.login} теперь доктор`
        );
      })
      .catch((err: any) => {
        console.error('Ошибка при загрузке:', err);
        this.notificationCustomService.handleErrorAsync(err, 'Держите меня, я падаю…');
      });
  }


  handleMakeUser(friend: Friend): void {
    this.smesharikService.makeUser(friend.login)
      .then((response: any) => {
        this.items = this.items.map(item =>
          item.login === friend.login ? {...item, role: Roles.USER} as Friend : item
        );
        this.notificationCustomService.handleSuccess(
          "Мода меняется",
          `смешарик с логином ${friend.login} теперь просто смешарик`
        );
      })
      .catch((err: any) => {
        console.error('Ошибка при загрузке:', err);
        this.notificationCustomService.handleErrorAsync(err, 'Держите меня, я падаю…');
      });
  }

  protected readonly Context = Context;
  protected readonly Roles = Roles;
  protected readonly GeneralStatus = GeneralStatus;
}
