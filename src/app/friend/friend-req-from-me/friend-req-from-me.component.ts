import {Component, inject, OnInit} from '@angular/core';
import {FriendCardComponent} from '../friend-card/friend-card.component';
import {NgForOf, NgIf} from '@angular/common';
import {BasePage} from '../../base/base-page';
import {Friend} from '../../model/friend';
import {SmesharikFacade} from '../../facade/smesharik.facade';

@Component({
  selector: 'app-friend-req-from-me',
  standalone: true,
  imports: [
    FriendCardComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './friend-req-from-me.component.html',
  styleUrl: './friend-req-from-me.component.css'
})
export class FriendReqFromMeComponent extends BasePage<Friend> implements OnInit{
  override action = "friend"
  friendFacade: SmesharikFacade = inject(SmesharikFacade);

  override preparing(item: any): any {
    return new Friend(item).toBackendJson();
  }
  ngOnInit(): void {
    this.fetchDataFromServer()
  }

  trackByLogin(index: number, friend: Friend) {
    return friend.login;
  }

  override fetchDataFromServer(replacementIsNeeded: boolean = false) {
    this.friendFacade.getApplicationFriends(
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
          this.notificationService.handleErrorAsync(err, 'Держите меня, я падаю…');
        }
      });
  }
}
