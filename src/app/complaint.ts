import {GeneralStatus, getEnumKeyByValue, ViolationType} from './enums';

export class Complaint{
  constructor(
    public id: number,
    public violationType: ViolationType,
    public description: string,
    public adminLogin: string | null,
    public post: number | null,
    public comment: number | null,
    public status: GeneralStatus,
    public creationDate: string,
    public closingDate: string,
  ) {}


  static fromBackend(data: any): Complaint {
    return new Complaint(
      data.id,
      ViolationType [data.violationType as keyof typeof ViolationType],
      data.description,
      data.admin ?? null,
      data.post ?? null,
      data.comment ?? null,
      GeneralStatus[data.status as keyof typeof GeneralStatus],
      data.creationDate,
      data.closingDate ?? ""
    );
  }

  toBackendJson(): Record<string, any> {
    const data: Record<string, any> = {
      id: this.id,
      violationType: getEnumKeyByValue(ViolationType, this.violationType),
      description: this.description,
      admin: this.adminLogin,
      post: this.post,
      comment: this.comment,
      status: getEnumKeyByValue(GeneralStatus, this.status),
      creationDate: this.creationDate,
      closingDate: this.closingDate,
    };

    Object.keys(data).forEach(
      (key) => (data[key] === "" || data[key] === null) && delete data[key]
    );

    return data;
  }


}
