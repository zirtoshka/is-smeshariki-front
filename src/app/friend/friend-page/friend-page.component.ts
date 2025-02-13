import {Component, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Context, FriendCardComponent} from '../friend-card/friend-card.component';
import {Friend} from '../../model/friend';
import {SearchFilterComponent} from '../../search-filter/search-filter.component';
import {BasePage} from '../../base/base-page';
import {SmesharikService} from '../../services/smesharik.service';
import {GeneralStatus} from '../../model/enums';

@Component({
  selector: 'app-friend-card-page',
  standalone: true,
  imports: [
    NgForOf,
    FriendCardComponent,
    SearchFilterComponent,
    NgIf,
  ],
  templateUrl: './friend-page.component.html',
  styleUrl: './friend-page.component.css'
})
export class FriendPageComponent extends BasePage<Friend> implements OnInit {

  override action = "friend"

  friendService: SmesharikService = inject(SmesharikService);


  override preparing(item: any): any {
    return new Friend(item).toBackendJson();
  }

  ngOnInit(): void {
    this.fetchDataFromServer()
  }

  override fetchDataFromServer(replacementIsNeeded: boolean = false) {
    this.friendService.getFriends(
      {
        page: this.page,
        size:4
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


  handleRemoveFriend(friend: Friend): void {
    console.log('Удалить друга:', friend);
    this.friendService.deleteFriend({follower: friend.login})
      .subscribe({
        next: (response) => {
          this.items = this.items.filter(item => item.login !== friend.login);
          this.notificationCustomService.handleSuccess(
            "Радикально!", response.message
          )
        },
        error: (err: any) => {
          console.error('Ошибка при загрузке:', err);
          this.notificationCustomService.handleErrorAsync(err, 'Держите меня, я падаю…');
        }
      });

  }

  trackByLogin(index: number, friend: Friend) {
    return friend.login;
  }

  protected readonly Context = Context;
  protected readonly GeneralStatus = GeneralStatus;
}
