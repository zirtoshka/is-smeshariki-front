import {Component, Input} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {Friend} from '../friend';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {NgIf} from '@angular/common';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {Roles} from '../auth-tools/smesharik';
import {RoleTagComponent} from '../role-tag/role-tag.component';

@Component({
  selector: 'app-friend',
  standalone: true,
  imports: [
    NzCardComponent,
    NzAvatarComponent,
    NzTagComponent,
    NgIf,
    NzIconDirective,
    RoleTagComponent
  ],
  templateUrl: './friend.component.html',
  styleUrl: './friend.component.css'
})
export class FriendComponent {
  @Input() friend!: Friend;



}
