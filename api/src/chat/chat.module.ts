import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { RoomService } from './services/room-service/room/room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './model/room.entity';

@Module({
  imports: [UserModule, AuthModule, TypeOrmModule.forFeature([RoomEntity])],
  providers: [ChatGateway, RoomService],
})
export class ChatModule {}
