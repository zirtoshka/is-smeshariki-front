export class Ban {
  constructor(
    public id:number,
    public reason:string,
    public smesharikId:number,
    public postId:number,
    public commentId:number,
    public creationDate:string,
    public endDate:string,
  ) {
  }
}
