import {Component, Input} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NgIf} from '@angular/common';
import {Ban} from '../ban';

@Component({
  selector: 'app-ban',
  standalone: true,
  imports: [
    NzCardComponent,
    NzAvatarComponent,
    NzIconDirective,
    NgIf
  ],
  templateUrl: './ban.component.html',
  styleUrl: './ban.component.css'
})
export class BanComponent {
 @Input() ban!:Ban;

  getAvatarPath(smesharikId: number): string {
    return `https://i.pravatar.cc/100?img=${smesharikId}`;
  }

  onPostClick(postId: number): void {
    console.log(`Переход к посту с ID: ${postId}`);
  }

  onCommentClick(commentId: number): void {
    console.log(`Переход к комментарию с ID: ${commentId}`);
  }
}
