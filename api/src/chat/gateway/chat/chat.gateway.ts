import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { IConnectedUser } from 'src/chat/model/connected-user.interface';
import { IPage } from 'src/chat/model/page.interface';
import { IRoom } from 'src/chat/model/room.interface';
import { ConnectedUserService } from 'src/chat/services/connected-user/connected-user.service';
import { RoomService } from 'src/chat/services/room-service/room.service';
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
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService,
    private connectedUserService: ConnectedUserService,
  ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
  }

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

      // Save connection to DB
      await this.connectedUserService.create({ socketId: socket.id, user });

      // Only emit rooms to the specific connected client
      return this.server.to(socket.id).emit('rooms', rooms);
    } catch {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    // Remove connection from DB
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: IRoom) {
    const createdRoom: IRoom = await this.roomService.createRoom(
      room,
      socket.data.user,
    );

    for (const user of createdRoom.users) {
      const connections: IConnectedUser[] =
        await this.connectedUserService.findByUser(user);

      const rooms = await this.roomService.getRoomsForUser(user.id, {
        page: 1,
        limit: 10,
      });

      for (const connection of connections) {
        this.server.to(connection.socketId).emit('rooms', rooms);
      }
    }
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
