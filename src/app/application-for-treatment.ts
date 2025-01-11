import {GeneralStatus} from './enums';
import {Propensity} from './propensity';

export class ApplicationForTreatment {
  constructor(
    public id: number,
    public postId: number | null,
    public commentId: number | null,
    public doctorId: number | null,
    public status: GeneralStatus,
    public propensityId: number
  ) {
  }
}
