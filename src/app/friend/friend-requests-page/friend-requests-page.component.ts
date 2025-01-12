import { Component } from '@angular/core';
import {Context, FriendCardComponent} from "../friend-card/friend-card.component";
import {NgForOf} from "@angular/common";
import {Friend} from '../../friend';
import {Roles} from '../../auth-tools/smesharik';

@Component({
  selector: 'app-friend-card-requests-page',
  standalone: true,
    imports: [
        FriendCardComponent,
        NgForOf
    ],
  templateUrl: './friend-requests-page.component.html',
  styleUrl: './friend-requests-page.component.css'
})
export class FriendRequestsPageComponent {
  friendList: Friend[] = [
    new Friend(
      'Крош',
      'krosh123',
      'https://i.pravatar.cc/100?img=3',
      true,
      '2023-01-01T12:00:00Z',
      Roles.user),
    new Friend(
      'Ежик',
      'ezhik456',
      'https://i.pravatar.cc/100?img=4',
      false,
      '2023-01-02T14:00:00Z',
      Roles.admin)];

  handleAddFriend(friend: Friend): void {
    console.log('Добавить друга:', friend);
  }

  protected readonly Context = Context;
}
