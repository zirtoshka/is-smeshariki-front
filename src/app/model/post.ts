export enum PostTag{
  draft='черновик',
  private='приватный',
  public='публичный'
}

export class Post {
  constructor(
    public id: number,
    public authorId: number,
    public isDraft: boolean,
    public isPrivate: boolean,
    public text: string,
    public pathToImage: string,
    public publicationDate: string,
    public creationDate: string,
    ) { }
}
