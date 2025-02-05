import {Component, OnInit} from '@angular/core';
import {NgForOf} from '@angular/common';
import {Context, FriendCardComponent} from '../friend-card/friend-card.component';
import {Friend} from '../../model/friend';
import {Roles} from '../../auth-tools/smesharik';
import {SearchFilterComponent} from '../../search-filter/search-filter.component';
import {BasePage} from '../../base/base-page';

@Component({
  selector: 'app-friend-card-page',
  standalone: true,
  imports: [
    NgForOf,
    FriendCardComponent,
    SearchFilterComponent
  ],
  templateUrl: './friend-page.component.html',
  styleUrl: './friend-page.component.css'
})
export class FriendPageComponent extends BasePage<Friend> implements OnInit {
  friendList: Friend[] = []
  //   new Friend(
  //     {'Крош',
  //     'krosh123',
  //     'https://i.pravatar.cc/100?img=3',
  //     true,
  //     '2023-01-01T12:00:00Z',
  //     Roles.USER}),
  //   new Friend(
  //     'Ежик',
  //     'ezhik456',
  //     'https://i.pravatar.cc/100?img=4',
  //     false,
  //     '2023-01-02T14:00:00Z',
  //     Roles.ADMIN)];

  ngOnInit(): void {
    this.fetchDataFromServer()
  }

  handleRemoveFriend(friend: Friend): void {
    console.log('Удалить друга:', friend);
  }

  protected readonly Context = Context;
}
