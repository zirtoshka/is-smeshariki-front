import {BaseModel} from '../model/base-data';

export enum Roles {
  ADMIN = "админ",
  USER = "смешарик",
  DOCTOR = "доктор"
}


export function fromString(role: string): Roles | null {
  return (Roles as any)[role] ?? null;
}


export class Smesharik extends BaseModel<Smesharik> {
  name: string;
  login: string;
  password: string | null;
  email: string;
  role: Roles;
  isOnline: boolean;
  lastActive: Date | null;
  color: string;

  constructor(
    data: any
  ) {
    super();
    this.name = data.name??'';
    this.login = data.login??'';
    this.password = data.password??'';
    this.email = data.email??'';
    this.role = Roles[data.role as keyof typeof Roles] ?? data.role;
    this.isOnline = data.isOnline??false;
    this.lastActive = data.lastActive ?? null;
    this.color = data.color??'';
  }

  toBackendJson(): Record<string, any> {
    const data: Record<string, any> = {
      login: this.login,
    };

    Object.keys(data).forEach(
      (key) => (data[key] === "" || data[key] === null) && delete data[key]
    );

    return data;
  }


}
