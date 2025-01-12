import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NgIf} from '@angular/common';
import {Ban} from '../../ban';
import {ContentBase} from '../../content-base';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {PostComponent} from '../../post/post.component';
import {CommentComponent} from '../../comment/comment.component';
import {BaseCard} from '../../base/base-card';
import {Propensity} from '../../propensity';

@Component({
  selector: 'app-ban-card',
  standalone: true,
  imports: [
    NzCardComponent,
    NzAvatarComponent,
    NzIconDirective,
    NgIf,
    NzButtonComponent,
    PostComponent,
    CommentComponent
  ],
  templateUrl: './ban-card.component.html',
  styleUrl: './ban-card.component.css'
})
export class BanCardComponent extends ContentBase<Ban>{

  @Input() declare item: Ban;
  @Output() override edit = new EventEmitter<Ban>();
  @Output() override delete = new EventEmitter<Ban>();


  getAvatarPath(smesharikId: number): string {
    return `https://i.pravatar.cc/100?img=${smesharikId}`;
  }

}
