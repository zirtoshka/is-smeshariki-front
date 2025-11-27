import {Component, inject, OnInit} from '@angular/core';
import {Context, FriendCardComponent} from "../friend-card/friend-card.component";
import {NgForOf, NgIf} from "@angular/common";
import {Friend} from '../../model/friend';
import {BasePage} from '../../base/base-page';
import {SmesharikService} from '../../services/smesharik.service';
import {GeneralStatus} from '../../model/enums';

@Component({
  selector: 'app-friend-card-requests-page',
  standalone: true,
  imports: [
    FriendCardComponent,
    NgForOf,
    NgIf,
  ],
  templateUrl: './friend-requests-page.component.html',
  styleUrl: './friend-requests-page.component.css'
})
export class FriendRequestsPageComponent extends BasePage<Friend> implements OnInit{

  override action = "friend"

  friendService: SmesharikService = inject(SmesharikService);

  override preparing(item: any): any {
    return new Friend(item).toBackendJson();
  }

  override fetchDataFromServer(replacementIsNeeded: boolean = false) {
    this.friendService.getFollowers(
      {
        page: this.page,
        size: 2
      })
      .subscribe({
        next: (response) => {
          const newItems = response.content.map(data => Friend.fromBackend(data));
          this.fetchHelper(newItems, replacementIsNeeded)
        },
        error: (err: any) => {
          this.notificationService.handleErrorAsync(err,'Держите меня, я падаю…');
        }
      });
  }

  ngOnInit(): void {
    this.fetchDataFromServer()
  }

  handleAddFriend(friend: Friend): void {
    console.log('Добавить друга:', friend);
    this.friendService.acceptFriend({follower: friend.login})
      .subscribe({
        next: (response:any) => {
          this.items = this.items.filter(item => item.login !== friend.login);
          this.notificationService.handleSuccess(
            "Мамма мия! Это же... Дружище!", response.message
          )
        },
        error: (err: any) => {
          this.notificationService.handleErrorAsync(err, 'Держите меня, я падаю…');
        }
      });
  }

  protected readonly Context = Context;
  protected readonly GeneralStatus = GeneralStatus;
}
