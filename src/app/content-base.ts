import {Post} from './model/post';
import {CommentS} from './model/comment';
import {BaseCard} from './base/base-card';
import {Smesharik} from './auth-tools/smesharik';

export abstract class ContentBase<T> extends BaseCard<T> {
  selectedPost: Post | null = null;
  selectedComment: CommentS | null = null;
  selectedSmesharik: Smesharik | null = null;
  posts: Post[] = [];
  //   new Post(8, 42, false, false, 'Текст поста 1', '', '2023-01-01T12:00:00Z', '2023-01-01T10:00:00Z'),
  //   new Post(2, 43, false, true, 'Текст поста 2', '', '2023-02-01T12:00:00Z', '2023-02-01T10:00:00Z'),
  // ];
  comments: CommentS[] = [
    new CommentS(1, "sdsdfs", 1, 2, null, '2023-02-01T12:00:00Z'),
    new CommentS(6, "sdsdfs", 1, 2, 1, '2023-02-01T12:00:00Z'),

  ]

  showPost(postId: number|string): void {
    //todo
    this.selectedPost = this.posts.find(post => post.id === postId) || null;
  }

  showSmesharik(smesharik: number|string): void {
    //todo
    this.selectedPost = this.posts.find(post => post.id === smesharik) || null;
  }

  showComment(commentId: number|string): void {
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
}
