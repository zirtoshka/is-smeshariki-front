import {BaseModel} from './base-data';

export class Propensity extends BaseModel<Propensity> {
  id: number | null;
  name: string;
  description: string;

  constructor(data: any) {
    super();
    this.id = data.id ?? null;
    this.name = data.name ?? "";
    this.description = data.description ?? "";
  }

  toBackendJson(): Record<string, any> {
    const data: Record<string, any> = {
      id: this.id,
      name: this.name,
      description: this.description,
    };

    Object.keys(data).forEach(
      (key) => (data[key] === "" || data[key] === null) && delete data[key]
    );
    return data;
  }
}
