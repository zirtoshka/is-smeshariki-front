import {Post} from './model/post';
import {CommentS} from './model/comment';
import {BaseCard} from './base/base-card';
import {Smesharik} from './auth-tools/smesharik';
import {Router} from '@angular/router';

export abstract class ContentBase<T> extends BaseCard<T> {
  selectedPost: Post | null = null;
  selectedComment: CommentS | null = null;
  selectedSmesharik: Smesharik | null = null;
  posts: Post[] = [];
  //   new Post(8, 42, false, false, 'Текст поста 1', '', '2023-01-01T12:00:00Z', '2023-01-01T10:00:00Z'),
  //   new Post(2, 43, false, true, 'Текст поста 2', '', '2023-02-01T12:00:00Z', '2023-02-01T10:00:00Z'),
  // ];
  comments: CommentS[] = []
  protected router: Router;

  constructor(router: Router) {
    super();
    this.router = router;
  }

  showPost(postId: number | string): void {
    //todo
    this.selectedPost = this.posts.find(post => post.id === postId) || null;
  }

  showSmesharik(smesharik: number | string): void {
    //todo
    this.selectedPost = this.posts.find(post => post.id === smesharik) || null;
  }

  showComment(commentId: number | string): void {
    this.selectedComment = this.comments.find(comment => comment.id === commentId) || null;
  }

  closePost(): void {
    this.selectedPost = null;
  }

  closeComment(): void {
    this.selectedComment = null;
  }

  closeSmesharik(): void {
    this.selectedSmesharik = null;
  }

  navigateToPost(postId: number): void {
    this.router.navigate(['/post-card', postId]);
  }

  navigateToComment(commentId: number): void {
    console.log(commentId);
    this.router.navigate(['/comment', commentId]);
  }

  navigateToSmesharik(login: string): void {
    this.router.navigate(['/smesharik', login]);
  }
}
