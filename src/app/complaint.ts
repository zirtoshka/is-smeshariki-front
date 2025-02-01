import {GeneralStatus, ViolationType} from './enums';

export class Complaint {
  constructor(
    public id: number,
    public violationType: ViolationType,
    public description: string,
    public adminLogin: string |null,
    public postId: number |null,
    public commentId: number | null,
    public status: GeneralStatus,
    public creationDate: string,
    public closingDate: string,
  ) {
  }
}
