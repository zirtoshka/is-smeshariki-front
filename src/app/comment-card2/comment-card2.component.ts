import {Component, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {CommentS} from '../model/comment';
import {CommentService} from '../services/comment.service';
import {map, Observable} from 'rxjs';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {NzListComponent, NzListItemComponent} from 'ng-zorro-antd/list';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzCommentComponent, NzCommentContentDirective} from 'ng-zorro-antd/comment';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzCardComponent} from 'ng-zorro-antd/card';

@Component({
  selector: 'app-comment-card2',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NzListItemComponent,
    NzListComponent,
    NzButtonComponent,
    NzCommentContentDirective,
    NzAvatarComponent,
    NzCommentComponent,
    NzCardComponent,
    AsyncPipe
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './comment-card2.component.html',
  styleUrl: './comment-card2.component.css'
})
export class CommentCard2Component implements OnInit {
  @Input() comment!: CommentS;

  @Output() loadRepliesEvent = new EventEmitter<number>();

  showReplies = false;

  // constructor(private commentService: CommentService) {
  // }

  ngOnInit() {
    this.commentService.commentTree$.pipe(
      map(tree => tree.has(this.comment.id)) //есть ли ответы
    ).subscribe(hasReplies => {
      if (hasReplies) {
        this.showReplies = true; // ответы уже загружены — сразу показать
      }
    });
  }

  protected commentService = inject(CommentService);

  replies$: Observable<CommentS[]> = this.commentService.commentTree$.pipe(
    map(tree => tree.get(this.comment.id) || [])
  );

  loadReplies(): void {
    console.log("loadReplies for " + this.comment.id);
    this.showReplies=false
    this.loadRepliesEvent.emit(this.comment.id);
  }


}
