import {Roles} from '../auth-tools/smesharik';

export class Friend {
  constructor(
    public name: string,
    public login: string,
    public avatar: string,
    public isOnline: boolean,
    public lastActive: string, //string is data when was online
    public role: Roles,
  ) {

  }
}
