import {Component} from '@angular/core';
import {NgForOf} from '@angular/common';
import {Context, FriendComponent} from '../friend/friend.component';
import {Friend} from '../friend';
import {Roles} from '../auth-tools/smesharik';

@Component({
  selector: 'app-friend-page',
  standalone: true,
  imports: [
    NgForOf,
    FriendComponent
  ],
  templateUrl: './friend-page.component.html',
  styleUrl: './friend-page.component.css'
})
export class FriendPageComponent {
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

  handleRemoveFriend(friend: Friend): void {
    console.log('Удалить друга:', friend);
  }

  protected readonly Context = Context;
}
