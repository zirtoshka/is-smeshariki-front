import {Smesharik} from '../auth-tools/smesharik';

export class CommentS {
  constructor(
    public id: number,
    public smesharik: string,
    public post: number | null,
    public creationDate: Date | null,
    public parentComment: number | null,
    public text: string,
    public hasChildren: boolean = false,
    public countCarrots: number = 0,
    public isLiked: boolean = false,
    public smesharikAuthor: Smesharik | null
  ) {
  }
}
