import { IUser } from 'src/user/model/user.interface';

export interface IRoom {
  id?: number;
  name?: string;
  descritpion?: string;
  users?: IUser[];
  created_at?: Date;
  updated_at?: Date;
}
