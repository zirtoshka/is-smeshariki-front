import {GeneralStatus, getEnumKeyByValue, ViolationType} from './enums';

export class Ban {
  constructor(
    public id: number,
    public reason: string,
    public smesharik: number | null,
    public post: number | null,
    public comment: number | null,
    public creationDate: Date | null,
    public endDate: Date | null,
  ) {
  }

  static fromBackend(data: any): Ban {
    return new Ban(
      data.id,
      data.reason,
      data.smesharik ?? null,
      data.post ?? null,
      data.comment ?? null,
      data.creationDate ?? "",
      data.endDate ?? ""
    );
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
