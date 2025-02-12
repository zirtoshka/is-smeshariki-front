import {Component, inject, OnInit} from '@angular/core';
import {Context, FriendCardComponent} from "../friend-card/friend-card.component";
import {NgForOf, NgIf} from "@angular/common";
import {Friend} from '../../model/friend';
import {BasePage} from '../../base/base-page';
import {SmesharikService} from '../../services/smesharik.service';
import {SearchFilterComponent} from '../../search-filter/search-filter.component';

@Component({
  selector: 'app-friend-card-requests-page',
  standalone: true,
  imports: [
    FriendCardComponent,
    NgForOf,
    SearchFilterComponent,
    NgIf
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
      })
      .subscribe({
        next: (response) => {
          const newItems = response.content.map(data => Friend.fromBackend(data));
          this.fetchHelper(newItems, replacementIsNeeded)
        },
        error: (err: any) => {
          console.error('Ошибка при загрузке:', err);
          this.notificationCustomService.handleErrorAsync(err,'Держите меня, я падаю…');
        }
      });
  }

  ngOnInit(): void {
    this.fetchDataFromServer()
  }


  handleAddFriend(friend: Friend): void {
    console.log('Добавить друга:', friend);
  }

  protected readonly Context = Context;
}
