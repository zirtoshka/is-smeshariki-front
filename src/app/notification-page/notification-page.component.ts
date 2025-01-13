import {Component, inject} from '@angular/core';
import {NotificationS} from '../notification';
import {UserService} from '../services/user.service';
import {NzCardComponent, NzCardMetaComponent} from 'ng-zorro-antd/card';
import {NgForOf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NotificationComponent} from '../notification/notification.component';

@Component({
  selector: 'app-notification-page',
  standalone: true,
  imports: [
    NzCardComponent,
    NzCardMetaComponent,
    NgForOf,
    NzButtonComponent,
    NotificationComponent
  ],
  templateUrl: './notification-page.component.html',
  styleUrl: './notification-page.component.css'
})
export class NotificationPageComponent {
  private userService = inject(UserService);

  notificationList: NotificationS[]=[
      {title: "навести друга", message:"твой друг ббобик слишком догло не был в сети, пора сходить к нему в гости"},
      {title: "навести друга", message:"твой друг ббобик слишком догло не был в сети, пора сходить к нему в гости"},
      {title: "навести друга", message:"твой друг ббобик слишком догло не был в сети, пора сходить к нему в гости"},
      {title: "навести друга", message:"твой друг ббобик слишком догло не был в сети, пора сходить к нему в гости"},
    ];

  deleteNotification(index: number): void {
    this.notificationList.splice(index, 1);
  }
}
