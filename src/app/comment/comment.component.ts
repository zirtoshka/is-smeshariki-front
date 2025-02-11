import {Component, Input, OnInit} from '@angular/core';
import {Location, NgIf} from '@angular/common';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {CommentS} from '../model/comment';
import {CommentService} from '../services/comment.service';
import {ActivatedRoute} from '@angular/router';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {BackButtonComponent} from '../back-button/back-button.component';


@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    NgIf,
    NzAvatarComponent,
    NzCardComponent,
    NzIconDirective,
    NzTagComponent,
    NzButtonComponent,
    BackButtonComponent
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {
  @Input() comment!: CommentS;
  @Input() isFeed = false

  constructor(private commentService: CommentService,
              private route: ActivatedRoute,
              private location: Location
  ) {
  }


  handleGoBack(): void {
    console.log('Go back clicked');
    this.location.back();
  }


  getAvatarPath(smesharikId: number): string {
    return `https://i.pravatar.cc/50?img=${smesharikId}`;
  }

  onPostClick(postId: number): void {
    console.log(`Переход к посту с ID: ${postId}`);
  }

  onCommentClick(commentId: number): void {
    console.log(`Переход к комментарию с ID: ${commentId}`);
  }

  ngOnInit(): void {
    if (!this.comment) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      // this.comment = this.commentService.getCommentsById(id)!;
    }
  }
}
