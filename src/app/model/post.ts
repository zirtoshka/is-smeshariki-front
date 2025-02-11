import {BaseModel} from './base-data';
import {Smesharik} from '../auth-tools/smesharik';

export enum PostTag {
  draft = 'черновик',
  private = 'приватный',
  public = 'публичный'
}

export class Post extends BaseModel<Post> {
  id: number;
  author: string;
  isDraft: boolean;
  isPrivate: boolean;
  text: string;
  pathToImage: string ;
  publicationDate: Date | null;
  creationDate: Date | null;
  countCarrots: number = 0;
  smesharikAuthor: Smesharik | null;

  constructor(data: any) {
    super();
    this.id = data.id;
    this.author = data.author;
    this.isDraft = data.isDraft;
    this.isPrivate = data.isPrivate;
    this.text = data.text;
    this.pathToImage = data.pathToImage;
    this.publicationDate = data.publicationDate;
    this.creationDate = data.creationDate;
    this.countCarrots = data.countCarrots;
    this.smesharikAuthor = data.smesharikAuthor;
  }

  toBackendJson(): Record<string, any> {
    const data: Record<string, any> = {
      id: this.id,
    };

    Object.keys(data).forEach(
      (key) => (data[key] === "" || data[key] === null) && delete data[key]
    );

    return data;
  }


}
