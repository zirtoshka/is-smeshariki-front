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



  toBackendJson(): Record<string, any> {
    const data: Record<string, any> = {
      id: this.id,
      violationType: getEnumKeyByValue(ViolationType, this.violationType),
      description: this.description,
      adminLogin: this.adminLogin,
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
