import {GeneralStatus, ViolationType} from './enums';

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
}
