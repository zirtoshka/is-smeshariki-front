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
    public password: string | null,
    public email: string,
    public role: Roles,
    public isOnline: boolean,
    public lastActive: string | null = null,
    public color: string
  ) {
  }

  static fromJson(data: any): Smesharik {
    console.log("Ответ от сервера:", data);
    return new Smesharik(
      data.name,
      data.login,
      data.password ?? null,
      data.email,
      fromString(data.role) ?? Roles.USER,
      data.isOnline,
      data.lastActive ?? null,
      data.color,
    );
  }

}
