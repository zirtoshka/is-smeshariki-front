import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NzCardComponent} from 'ng-zorro-antd/card';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NgForOf, NgIf} from '@angular/common';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {Post} from '../post';
import {PostService} from '../services/post.service';
import {ActivatedRoute} from '@angular/router';
import {carrotIcon, carrotTouchedIcon, IconService} from '../services/icon.service';
import {CarrotCountComponent} from '../carrot-count/carrot-count.component';
import {CommentS} from '../comment';
import {NestedCommComponent} from '../nested-comm/nested-comm.component';
import {CommentService} from '../services/comment.service';
import {Likeable} from '../base/likeable';
import {PostTagComponent} from '../post-tag/post-tag.component';


@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    NzCardComponent,
    NzAvatarComponent,
    NzIconDirective,
    NgIf,
    NzTagComponent,
    CarrotCountComponent,
    NgForOf,
    NestedCommComponent,
    PostTagComponent
  ],
  providers: [PostService],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent implements OnInit, OnChanges, Likeable {
  commentsList: CommentS[] = [];
  isCommentsVisible: boolean = false;
  isCommentExisted: boolean = false;
  isLiked = false;


  @Input() post!: Post;

  iconCarrot = carrotIcon;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private iconService: IconService,
    protected commentService: CommentService,
  ) {
    // this.commentsList =
    //   [
    //   new CommentS(1, 'Это первый комментарий', 1, 1, null, '2025-01-12'),
    //   new CommentS(2, 'Это вложенный комментарий', 1, 1, 1, '2025-01-12'),
    //   new CommentS(3, 'Еще один комментарий', 1, 1, null, '2025-01-13'),
    //   new CommentS(4, 'Еще один вложенный комментарий', 1, 1, 3, '2025-01-13'),
    //   new CommentS(5, 'Это вложенный комментарий', 1, 1, 2, '2025-01-12'),
    //
    // ];
  }


  ngOnInit(): void {
    if (!this.post) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.post = this.postService.getPostById(id)!;
      this.commentsList = this.commentService.getCommentsByPostId(this.post.id);
      this.isCommentExisted = this.commentsList.length > 0;
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post']) {
      this.commentsList = this.commentService.getCommentsByPostId(this.post.id);
      this.isCommentExisted = this.commentsList.length > 0;
    }
  }


  toggleLike() {
    this.isLiked = !this.isLiked;
    this.iconCarrot = this.isLiked ? carrotTouchedIcon : carrotIcon;

    const url = this.isLiked
      ? `/api/posts/${this.post.id}/like`
      : `/api/posts/${this.post.id}/unlike`;

    console.log("происходит морковканье поста с ид", this.post.id, url)
  }

  toggleComments() {
    this.isCommentsVisible = !this.isCommentsVisible;
  }


}
