import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CORE } from 'src/common/constants/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateStatusUserDto } from './dto/update-status-user.dto';
import { Status } from 'src/common/enums/enums';
import { DateTime } from "luxon";
import { ApiResponseListDto, ApiResponseObjectDto } from 'src/common/dtos/api-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, CORE)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<ApiResponseObjectDto<string>> {
    const userFound: User = await this.userRepository.findOne({
      where: {
        email: createUserDto.email
      }
    });
    if (userFound) {
      throw new BadRequestException('User already exists',
        {
          description: 'There was an error while registering user'
        });
    }
    const user: User = this.userRepository.create(createUserDto);
    const createdUser = await this.userRepository.save({
      ...user
    });
    if (!createdUser.uuid) {
      throw new InternalServerErrorException('Application error', {
        description: 'There was an error while creating the user'
      });
    }

    // TODO: REGISTER USER INTO SECURITY DB

    return {
      'message': 'User created successfully',
      'detail': createdUser.uuid
    };
  }

  async findAll(): Promise<ApiResponseListDto<User>> {
    const userList: User[] = await this.userRepository.find();
    if (!userList) {
      throw new InternalServerErrorException('Application error', {
        description: 'There was an error while fetching users'
      });
    }
    return {
      'message': 'User data retrieved successfully',
      'detail': userList
    };
  }

  async findOne(uuid: string): Promise<ApiResponseObjectDto<User>> {
    const userFound: User = await this.userRepository.findOne({
      where: {
        uuid: uuid
      }
    });
    if (!userFound) {
      throw new NotFoundException('User not found', {
        description: 'There was an error while fetching user'
      });
    }
    return {
      'message': 'User data retrieved successfully',
      'detail': userFound
    };
  }

  async update(uuid: string, updateUserDto: UpdateUserDto): Promise<ApiResponseObjectDto<string>> {
    const updatedUser: UpdateResult = await this.userRepository.update({
      uuid: uuid
    }, {
      ...updateUserDto
    });
    if (!updatedUser.affected) {
      throw new NotFoundException('User not found', {
        description: 'There was an error while updating the user'
      });
    }

    // TODO: UPDATE USER INTO SECURITY DB

    return {
      'message': 'User values updated successfully',
      'detail': updatedUser.affected.toString()
    };
  }

  async remove(uuid: string, updateStatusDTO: UpdateStatusUserDto): Promise<ApiResponseObjectDto<string>> {
    const deletedUser: UpdateResult = await this.userRepository.update({
      uuid: uuid
    }, {
      modifiedBy: updateStatusDTO.modifiedBy,
      deletedAt: DateTime.now(),
      deletedBy: updateStatusDTO.modifiedBy,
      status: Status.INACTIVE
    });
    if (!deletedUser.affected) {
      throw new NotFoundException('User not found', {
        description: 'There was an error while deleting the user'
      });
    }

    // TODO: DISABLE USER ACCOUNT FROM SECURITY DB

    return {
      'message': 'User removed successfully',
      'detail': deletedUser.affected.toString()
    };
  }

  async restore(uuid: string, updateStatusDTO: UpdateStatusUserDto): Promise<ApiResponseObjectDto<string>> {
    const restoredUser: UpdateResult = await this.userRepository.update({
      uuid: uuid
    }, {
      modifiedBy: updateStatusDTO.modifiedBy,
      deletedAt: null,
      deletedBy: null,
      status: Status.ACTIVE
    });
    if (!restoredUser.affected) {
      throw new NotFoundException('User not found', {
        description: 'There was an error while restoring the user'
      });
    }

    // TODO: RESTORE USER ACCOUNT FROM SECURITY DB

    return {
      'message': 'User restored successfully',
      'detail': restoredUser.affected.toString()
    };
  }
}
