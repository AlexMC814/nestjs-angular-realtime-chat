import { Injectable } from '@angular/core';
import { CustomSocket } from '../../sockets/custom-socket';
import { IRoom, IRoomPaginate } from '../../../model/room.interface';
import { IUser } from '../../../model/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { IMessage, IMessagePaginate } from '../../../model/message.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: CustomSocket, private snackbar: MatSnackBar) { }

  sendMessage(message: IMessage) {
    this.socket.emit('addMessage', message);
  }

  joinRoom(room: IRoom) {
    this.socket.emit('joinRoom', room);
  }

  leaveRoom(room: IRoom) {
    this.socket.emit('leaveRoom', room);
  }

  getMessages(): Observable<IMessagePaginate> {
    return this.socket.fromEvent<IMessagePaginate>('messages');
  }

  getAddedMessage(): Observable<IMessage> {
    return this.socket.fromEvent<IMessage>('messageAdded');
  }

  getMyRooms(): Observable<IRoom[]> {
    return this.socket.fromEvent<IRoom[]>('rooms');
  }

  emitGetRooms() {
    this.socket.emit('getRooms');
  }

  createRoom(room: IRoom) {
    this.socket.emit('createRoom', room);
    this.snackbar.open(`Room ${room.name} created successfully`, 'Close', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    })
  }
}
