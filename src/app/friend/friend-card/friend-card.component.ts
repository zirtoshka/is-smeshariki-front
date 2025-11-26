import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {Friend} from '../../model/friend';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {DatePipe, NgIf} from '@angular/common';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {RoleTagComponent} from '../../role-tag/role-tag.component';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {AvatarComponent} from '../../avatar/avatar.component';
import {Roles} from '../../auth-tools/smesharik';
import {DataFormaterService} from '../../data-formater.service';
import {Router} from '@angular/router';
import {AuthService} from '../../auth-tools/auth.service';

export enum Context {
  friends,
  requests,
  admin,
  doctor,
  search

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
  @Output() makeDoctor = new EventEmitter<Friend>();
  @Output() makeFriend = new EventEmitter<Friend>();
  @Output() makeUser = new EventEmitter<Friend>();


  constructor(protected dateFormatterService: DataFormaterService,
              private router: Router,
              private authService: AuthService) {
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
    this.makeDoctor.emit(friend);
  }

  onMakeFriend(friend: Friend): void {
    this.makeFriend.emit(friend);
  }

  onMakeUser(friend: Friend): void {
    this.makeUser.emit(friend);
  }

  isAdmin() {
    return this.authService.isAdmin;
  }

  navigateToSmesharik(login: string): void {
    if(login === null) return
    this.router.navigate(['/smesharik', login]);
  }



  protected readonly Context = Context;
  protected readonly Roles = Roles;
}
