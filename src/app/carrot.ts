export class Carrot {
  constructor(
    public id: number,
    public smesharikId: number,
    public postId: number | null,
    public commentId: number | null,
    public creationDate: string
  ) {
  }
}
