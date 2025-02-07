export enum Roles {
  ADMIN = "админ",
  USER = "смешарик",
  DOCTOR = "доктор"
}


export function fromString(role: string): Roles | null {
  return (Roles as any)[role] ?? null;
}


export class Smesharik {
  constructor(
    public name: string,
    public login: string,
    public password: string,
    public email: string,
    public role: Roles,
    public isOnline: boolean,
    public lastActive: string,
    public color:string
  ) {
  }

  static fromJson(data: any): Smesharik {
    return new Smesharik(
      data.name,
      data.login,
      data.password,
      data.email,
      fromString(data.role) ?? Roles.USER,
      data.isOnline,
      data.lastActive,
      data.color,
    );
  }
}
