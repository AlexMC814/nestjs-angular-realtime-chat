import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from 'src/chat/model/connected-user/connected-user.entity';
import { IConnectedUser } from 'src/chat/model/connected-user/connected-user.interface';
import { IUser } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>,
  ) {}

  async create(connectedUser: IConnectedUser): Promise<IConnectedUser> {
    return this.connectedUserRepository.save(connectedUser);
  }

  async findByUser(user: IUser): Promise<IConnectedUser[]> {
    return this.connectedUserRepository.find({ where: { user } });
  }

  async deleteBySocketId(socketId: string) {
    return this.connectedUserRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.connectedUserRepository.createQueryBuilder().delete().execute();
  }
}
