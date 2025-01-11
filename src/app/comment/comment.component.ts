import { Component, Input } from '@angular/core';
import {NgIf} from '@angular/common';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {CommentS} from '../comment';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    NgIf,
    NzAvatarComponent,
    NzCardComponent,
    NzIconDirective,
    NzTagComponent
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() comment!: CommentS;

  getAvatarPath(smesharikId: number): string {
    return `https://i.pravatar.cc/50?img=${smesharikId}`;
  }

  onPostClick(postId: number): void {
    console.log(`Переход к посту с ID: ${postId}`);
  }

  onCommentClick(commentId: number): void {
    console.log(`Переход к комментарию с ID: ${commentId}`);
  }
}
