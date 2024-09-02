import { Injectable } from '@angular/core';
import { CustomSocket } from '../../sockets/custom-socket';
import { IRoom, IRoomPaginate } from '../../../model/room.interface';
import { IUser } from '../../../model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: CustomSocket) { }

  sendMessage() {}

  getMessage() {
    return this.socket.fromEvent('message');
  }

  getMyRooms() {
    return this.socket.fromEvent<IRoomPaginate>('rooms')
  }

  emitPaginateRooms(limit: number, page: number) {
    this.socket.emit('paginateRooms', { limit, page });
  }

  createRoom() {

    // this.socket.emit('createRoom', room);
  }
}
