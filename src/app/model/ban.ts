import {BaseModel} from './base-data';

export class Ban  extends BaseModel<Ban>{
  id: number | null;
  reason: string;
  smesharik: any;
  post: string | null;
  comment: string | null;
  creationDate: string;
  endDate: string;

  constructor(data: any) {
    super();
    this.id = data.id ?? null;
    this.reason = data.reason ?? "";
    this.smesharik = data.smesharik ?? null;
    this.post = data.post ?? null;
    this.comment = data.comment ?? null;
    this.creationDate = data.creationDate ?? "";
    this.endDate = data.endDate ?? "";
  }

  toBackendJson(): Record<string, any> {
    const data: Record<string, any> = {
      id: this.id,
      reason: this.reason,
      smesharik: this.smesharik,
      post: this.post,
      comment: this.comment,
      creationDate: this.creationDate,
      endDate: this.endDate,
    };

    Object.keys(data).forEach(
      (key) => (data[key] === "" || data[key] === null) && delete data[key]
    );

    return data;
  }
}
