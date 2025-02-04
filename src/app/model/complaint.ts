import {GeneralStatus, getEnumKeyByValue, ViolationType} from './enums';
import {BaseModel} from './base-data';

export class Complaint extends BaseModel<Complaint> {
  id: number;
  violationType: ViolationType;
  description: string;
  adminLogin: string | null;
  post: number | null;
  comment: number | null;
  status: GeneralStatus;
  creationDate: Date | null;
  closingDate: Date | null;

  constructor(data: any) {
    super();
    this.id = data.id;
    this.violationType = ViolationType [data.violationType as keyof typeof ViolationType];
    this.description = data.description;
    this.adminLogin = data.admin ? data.admin: data.adminLogin;
    this.post = data.post ?? null;
    this.comment = data.comment ?? null;
    this.status = GeneralStatus[data.status as keyof typeof GeneralStatus] ?? data.status;
    this.creationDate = data.creationDate;
    this.closingDate = data.closingDate ?? null;

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
