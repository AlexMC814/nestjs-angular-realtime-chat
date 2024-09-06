import { IUser } from 'src/user/model/user.interface';

export interface IConnectedUser {
  id?: number;
  socketId: string;
  user: IUser;
}
