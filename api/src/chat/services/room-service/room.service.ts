import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/chat/model/room/room.entity';
import { IRoom } from 'src/chat/model/room/room.interface';
import { IUser } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async createRoom(room: IRoom, creator: IUser): Promise<IRoom> {
    const newRoom = await this.addCreatorToRoom(room, creator);
    return this.roomRepository.save(newRoom);
  }

  async addCreatorToRoom(room: IRoom, creator: IUser) {
    room.users.push(creator);
    return room;
  }

  async getRoom(roomId: number): Promise<IRoom> {
    return this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['users'],
    });
  }

  async getRoomsForUser(userId: number): Promise<IRoom[]> {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('room.users', 'all_users')
      .orderBy('room.updated_at', 'DESC')
      .getMany();

    return query;
  }
}
