import {Smesharik} from '../auth-tools/smesharik';
import {BaseModel} from './base-data';

export class CommentS extends BaseModel<CommentS> {
  id: number;
  smesharik: string;
  post: number | null;
  creationDate: Date | null;
  parentComment: number | null;
  text: string;
  hasChildren: boolean = false;
  countCarrots: number = 0;
  isLiked: boolean = false;
  smesharikAuthor: Smesharik ;
  level: number;


  constructor(data: any) {
    super();
    this.id = data.id;
    this.smesharik = data.smesharik ?? null;
    this.post = data.post ?? null;
    this.creationDate = data.creationDate ?? null;
    this.parentComment = data.parentComment ?? null;
    this.text = data.text ?? null;
    this.hasChildren = data.hasChildren;
    this.countCarrots = data.countCarrots || 0;
    this.smesharikAuthor = data.smesharikAuthor ?? null;
    this.isLiked = data.isLiked ?? false;
    this.level = data.level || 0;

  }

  toBackendJson(): Record<string, any> {
    const data: Record<string, any> = {
      post: this.post,
      parentComment: this.parentComment,
      text: this.text,
    };

    Object.keys(data).forEach(
      (key) => (data[key] === "" || data[key] === null) && delete data[key]
    );

    return data;
  }
}
