import {GeneralStatus, getEnumKeyByValue, ViolationType} from './enums';
import {BaseModel} from './base-data';

export class ApplicationForTreatment extends BaseModel<ApplicationForTreatment> {
  id: number;
  post: number | null;
  comment: number | null;
  doctor: string | null = null;
  status: GeneralStatus;
  propensities: number[] | null = null;

  constructor(data: any) {
    super();
    this.id = data.id;
    this.post = data.post ?? null;
    this.comment = data.comment ?? null;
    this.doctor = data.doctor ?? null;
    this.status = GeneralStatus[data.status as keyof typeof GeneralStatus] ?? data.status;
    this.propensities = data.propensities ?? null;
  }

  toBackendJson(): Record<string, any> {
    const data: Record<string, any> = {
      id: this.id,
      post: this.post,
      comment: this.comment,
      doctor: this.doctor,
      status: getEnumKeyByValue(GeneralStatus, this.status),
      propensities: this.propensities,
    };

    Object.keys(data).forEach(
      (key) => (data[key] === "" || data[key] === null) && delete data[key]
    );

    return data;
  }
}
