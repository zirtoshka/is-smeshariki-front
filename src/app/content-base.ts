import {Post} from './post';
import {CommentS} from './comment';

export class ContentBase {
  selectedPost: Post|null = null;
  selectedComment: CommentS|null = null;
  posts: Post[] = [
    new Post(101, 42, false, false, 'Текст поста 1', '', '2023-01-01T12:00:00Z', '2023-01-01T10:00:00Z'),
    new Post(2, 43, false, true, 'Текст поста 2', '', '2023-02-01T12:00:00Z', '2023-02-01T10:00:00Z'),
  ];
  comments :CommentS[]=[
    new CommentS(1, "sdsdfs", 1,2,null,'2023-02-01T12:00:00Z'),
    new CommentS(3, "sdsdfs", 1,2,1,'2023-02-01T12:00:00Z'),

  ]

  showPost( postId: number): void {
    this.selectedPost = this.posts.find(post => post.id === postId) || null;
  }

  showComment(commentId: number): void {
    this.selectedComment = this.comments.find(comment => comment.id === commentId) || null;
  }

  closePost(): void {
    this.selectedPost = null;
  }

  closeComment(): void {
    this.selectedComment = null;
  }
}
