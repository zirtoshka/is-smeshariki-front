import {Injectable} from '@angular/core';
import {CommentS} from '../comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  comments: CommentS[];

  constructor() {
    const a = [
      new CommentS(1, 'Это первый комментарий', 1, 1, null, '2025-01-12'),
      new CommentS(2, 'Это вложенный комментарий', 1, 1, 1, '2025-01-12'),
      new CommentS(3, 'Еще один комментарий', 1, 1, null, '2025-01-13'),
      new CommentS(4, 'Еще один вложенный комментарий', 1, 1, 3, '2025-01-13'),
      new CommentS(5, 'Это вложенный комментарий', 1, 1, 2, '2025-01-12'),

    ]
    const b = Array.from({length: 10}, (_, i) => {
      const id = i + 5;
      const smesharikId = Math.floor(Math.random() * 50) + 1;
      const postId = Math.floor(Math.random() * 10) + 1;
      const commentNested = Math.random() < 0.8;
      const commentId = commentNested ?
        Math.floor(Math.random() * 100) + 1
        : null;
      const text = `Текст поста ${id}. ` +
        'От твоего взгляда моё сердце дрожит, как пустой холодильник.'
          .repeat(20).slice(0, 200);
      const creationDate = new Date(Date.now() - id * 10000000).toISOString();

      return new CommentS(id, text, smesharikId, postId, commentId, creationDate,);
    });
    this.comments = [...b, ...a]
  }


  getCommentsByPostId(postId: number | null) {
    if (postId == null) {
      return [];
    }
    return this.comments.filter((com) => com.postId === postId);
  }
  getCommentsById(id: number | null) {
    if (id != null) {
      return this.comments.filter((comment) => comment.id != id)[0];
    }
    return;
  }

  groupComments(comments: CommentS[]) {
    const map: { [key: string]: CommentS[] } = {};
    comments.forEach((comment: CommentS) => {
      const parentId = comment.commentId !== null ? comment.commentId?.toString() : 'null';
      if (!map[parentId]) {
        map[parentId] = [];
      }
      map[parentId].push(comment);
    });
    const buildCommentTree = (parentId: string): any[] => {
      return (map[parentId] || []).map((comment: CommentS) => {
        return {
          rootComment: comment,
          childComments: buildCommentTree(comment.id.toString()),
        };
      });
    };
    return buildCommentTree('null');
  }
}
