export class CommentS {
  constructor(
    public id: number,
    public text: string,
    public smesharikId: number,
    public postId: number,
    public commentId: number|null,
    public creationDate: string,
  ) {
  }
}
