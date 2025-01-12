import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {Friend} from '../../friend';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {NgIf} from '@angular/common';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {RoleTagComponent} from '../../role-tag/role-tag.component';
import {NzButtonComponent} from 'ng-zorro-antd/button';

export enum  Context {
  friends,
  requests

}

@Component({
  selector: 'app-friend-card',
  standalone: true,
  imports: [
    NzCardComponent,
    NzAvatarComponent,
    NzTagComponent,
    NgIf,
    NzIconDirective,
    RoleTagComponent,
    NzButtonComponent
  ],
  templateUrl: './friend-card.component.html',
  styleUrl: './friend-card.component.css'
})
export class FriendCardComponent {
  @Input() friend!: Friend;

  @Input() context!: Context;

  @Output() addFriend = new EventEmitter<Friend>();
  @Output() removeFriend = new EventEmitter<Friend>();

  onAddFriend(friend: Friend): void {
    this.addFriend.emit(friend);
  }

  onRemoveFriend(friend: Friend): void {
    this.removeFriend.emit(friend);
  }


  protected readonly Context = Context;
}
