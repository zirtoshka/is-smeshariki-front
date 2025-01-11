export enum Roles{
  admin,
  user,
  doctor
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
}
