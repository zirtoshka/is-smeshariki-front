import { Injectable } from '@angular/core';
import {Carrot} from '../carrot';

@Injectable({
  providedIn: 'root'
})
export class CarrotService {
  carrots: Carrot[] = Array.from({ length: 100 }, (_, i) => {
    const id = i + 1;
    const smesharikId = Math.floor(Math.random() * 50) + 1;
    const dataId = Math.floor(Math.random() * 50) + 1;
    const postOrComment = Math.random() < 0.5;
    const postId = postOrComment ? dataId : null;
    const commentId = postOrComment ? null : dataId;
    const creationDate = new Date(Date.now() - id * 10000000).toISOString();

    return new Carrot(id, smesharikId, postId, commentId, creationDate);
  });

  constructor() { }

  getCarrotCountPost(postId: number|null) {
    if (postId == null ) {
      return 0;
    }
    return this.carrots.filter((carrot) => carrot.postId === postId).length;
  }

  getCarrotCountComment(commentId: number|null) {
    if (commentId == null ) {
      return 0;
    }
    return this.carrots.filter((carrot) => carrot.commentId === commentId).length;
  }
}
