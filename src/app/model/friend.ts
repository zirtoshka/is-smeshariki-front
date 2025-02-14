import {Roles} from '../auth-tools/smesharik';
import {BaseModel} from './base-data';

export class Friend extends BaseModel<Friend> {
  id: number | null;
  name: string;
  login: string;
  color: string;
  isOnline: boolean;
  lastActive: Date | null; //string is data when was online
  role: Roles;
  isMyFriend: boolean = false;
  isMyFollower:boolean =false;
  isIFollow:boolean =false;


  constructor(data: any) {
    super();
    this.id = data.id ?? null;
    this.name = data.name;
    this.login = data.login;
    this.color = data.color;
    this.isOnline = data.isOnline;
    this.lastActive = data.lastActive ?? null;
    this.role = Roles[data.role as keyof typeof Roles] ?? data.role;
    this.isMyFriend = false;
    this.isMyFollower = false;
    this.isIFollow = false;
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
