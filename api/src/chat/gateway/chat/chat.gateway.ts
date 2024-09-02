import { UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { IPage } from 'src/chat/model/page.interface';
import { IRoom } from 'src/chat/model/room.interface';
import { RoomService } from 'src/chat/services/room-service/room/room.service';
import { IUser } from 'src/user/model/user.interface';
import { UserService } from 'src/user/services/user-service/user.service';

@WebSocketGateway({
  cors: {
    origin: [
      'https://hoppscotch.io',
      'http://localhost:3000',
      'http://localhost:4200',
    ],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService,
  ) {}

  @SubscribeMessage('message')
  handleMessage() {
    this.server.emit('message', 'test');
  }

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: IUser = await this.userService.getOne(decodedToken.user.id);

      if (!user) {
        return this.disconnect(socket);
      }

      socket.data.user = user;
      const rooms = await this.roomService.getRoomsForUser(user.id, {
        page: 1,
        limit: 10,
      });
      //  substruct page-1 to match the angular material paginator
      rooms.meta.currentPage = rooms.meta.currentPage - 1;

      // Only emit rooms to the specific connected client
      return this.server.to(socket.id).emit('rooms', rooms);
    } catch {
      return this.disconnect(socket);
    }
  }

  handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: IRoom): Promise<IRoom> {
    return this.roomService.createRoom(room, socket.data.user);
  }

  @SubscribeMessage('paginateRooms')
  async onPaginateRoom(socket: Socket, page: IPage) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    //  add page+1 to match the angular material paginator
    page.page = page.page + 1;
    const rooms = await this.roomService.getRoomsForUser(
      socket.data.user.id,
      page,
    );
    //  substruct page-1 to match the angular material paginator
    rooms.meta.currentPage = rooms.meta.currentPage - 1;
    return this.server.to(socket.id).emit('rooms', rooms);
  }
}
