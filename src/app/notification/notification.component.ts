import {Component, Input} from '@angular/core';
import {NgForOf} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {NotificationS} from '../notification';

@Component({
  selector: 'app-notification',
  standalone: true,
    imports: [
        NgForOf,
        NzButtonComponent,
        NzCardComponent,
        NzCardMetaComponent
    ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  @Input() notification!: NotificationS;

  deleteNotification(){
    console.log(this.notification);
  }
}
