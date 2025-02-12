import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {DatePipe, NgIf} from '@angular/common';
import {Ban} from '../../model/ban';
import {ContentBase} from '../../content-base';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {PostCardComponent} from '../../post-card/post-card.component';
import {Context, FriendCardComponent} from '../../friend/friend-card/friend-card.component';
import {DataFormaterService} from '../../data-formater.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ban-card',
  standalone: true,
  imports: [
    NzCardComponent,
    NzAvatarComponent,
    NzIconDirective,
    NgIf,
    NzButtonComponent,
    PostCardComponent,
    FriendCardComponent
  ],
  providers: [DatePipe],
  templateUrl: './ban-card.component.html',
  styleUrl: './ban-card.component.css'
})
export class BanCardComponent extends ContentBase<Ban> {

  @Input() declare item: Ban;
  @Output() override edit = new EventEmitter<Ban>();
  @Output() override delete = new EventEmitter<Ban>();

  constructor(protected dateFormatterService: DataFormaterService,
            router: Router) {
    super(router);
  }


}
