import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { RoomService } from './services/room-service/room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './model/room.entity';
import { ConnectedUserService } from './services/connected-user/connected-user.service';
import { ConnectedUserEntity } from './model/connected-user.entity';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([RoomEntity, ConnectedUserEntity]),
  ],
  providers: [ChatGateway, RoomService, ConnectedUserService],
})
export class ChatModule {}
