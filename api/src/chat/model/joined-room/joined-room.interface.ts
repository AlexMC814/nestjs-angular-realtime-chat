import { IUser } from 'src/user/model/user.interface';
import { IRoom } from '../room/room.interface';

export interface IJoinedRoom {
  id?: number;
  socketId: string;
  user: IUser;
  room: IRoom;
}
