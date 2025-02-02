export enum Roles {
  ADMIN = 'админ',
  USER = 'смешарик',
  DOCTOR = 'доктор'
}

export namespace Roles {
  export function fromString(role: string): Roles | null {
    return (Roles as any)[role] ?? null;
  }
}

export class Smesharik {
  constructor(
    public name: string,
    public login: string,
    public password: string,
    public email: string,
    public role: Roles,
    public isOnline: boolean,
    public lastActive: string
  ) {
  }

  static fromJson(data: any): Smesharik {
    return new Smesharik(
      data.name,
      data.login,
      data.password,
      data.email,
      Roles.fromString(data.role) ?? Roles.USER,
      data.isOnline,
      data.lastActive
    );
  }
}
