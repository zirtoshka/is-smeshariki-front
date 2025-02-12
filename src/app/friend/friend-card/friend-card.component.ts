import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {Friend} from '../../model/friend';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {DatePipe, NgIf} from '@angular/common';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {RoleTagComponent} from '../../role-tag/role-tag.component';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {BasePage} from '../../base/base-page';
import {AvatarComponent} from '../../avatar/avatar.component';
import {Smesharik} from '../../auth-tools/smesharik';
import {DataFormaterService} from '../../data-formater.service';

export enum Context {
  friends,
  requests,
  admin,
  doctor

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
    NzButtonComponent,
    AvatarComponent
  ],
  providers: [DatePipe],
  templateUrl: './friend-card.component.html',
  styleUrl: './friend-card.component.css'
})
export class FriendCardComponent {
  @Input() friend!: Friend;

  @Input() context!: Context;

  @Output() addFriend = new EventEmitter<Friend>();
  @Output() removeFriend = new EventEmitter<Friend>();
  @Output() makeAdmin = new EventEmitter<Friend>();

  constructor(protected dateFormatterService: DataFormaterService) {
  }

  onAddFriend(friend: Friend): void {
    this.addFriend.emit(friend);
  }

  onRemoveFriend(friend: Friend): void {
    this.removeFriend.emit(friend);
  }

  onMakeAdmin(friend: Friend): void {
    this.makeAdmin.emit(friend);
  }

  onMakeDoctor(friend: Friend): void {
    this.makeAdmin.emit(friend);
  }

  protected readonly Context = Context;
}
