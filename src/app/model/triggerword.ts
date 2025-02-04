import {HasId} from './hasid';
import {BaseModel} from './base-data';

export class Word extends BaseModel<Word> {
  id: number | null;
  word: string;
  propensity: string;

  constructor(data: any) {
    super();
    this.id = data.id ?? null;
    this.word = data.word ?? "";
    this.propensity = data.propensity ?? "";
  }

  toBackendJson(): Record<string, any> {
    const data: Record<string, any> = {
      id: this.id,
      word: this.word,
      propensity: this.propensity,
    };

    Object.keys(data).forEach(
      (key) => (data[key] === "" || data[key] === null) && delete data[key]
    );

    return data;
  }

}
