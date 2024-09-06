import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedRoomEntity } from 'src/chat/model/joined-room/joined-room.entity';
import { IJoinedRoom } from 'src/chat/model/joined-room/joined-room.interface';
import { IRoom } from 'src/chat/model/room/room.interface';
import { IUser } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class JoinedRoomService {
  constructor(
    @InjectRepository(JoinedRoomEntity)
    private readonly joinedRoomRepository: Repository<JoinedRoomEntity>,
  ) {}

  async create(joinedRoom: IJoinedRoom): Promise<IJoinedRoom> {
    return this.joinedRoomRepository.save(joinedRoom);
  }

  async findByUser(user: IUser): Promise<IJoinedRoom[]> {
    return this.joinedRoomRepository.find({ where: { user } });
  }

  async findByRoom(room: IRoom): Promise<IJoinedRoom[]> {
    return this.joinedRoomRepository.find({ where: { room } });
  }

  async deletedBySocketID(socketId: string) {
    return this.joinedRoomRepository.delete(socketId);
  }

  async deleteAll() {
    await this.joinedRoomRepository.createQueryBuilder().delete().execute();
  }
}
