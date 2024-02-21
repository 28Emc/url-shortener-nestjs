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
import * as bcrypt from "bcrypt";
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
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user: User = this.userRepository.create(createUserDto);
    const { password, ...createdUser } = await this.userRepository.save({
      ...user
    });
    if (!createdUser.userId) {
      throw new InternalServerErrorException('Application error', {
        description: 'There was an error while creating the user'
      });
    }
    return {
      'message': 'User created successfully',
      'detail': ''
    };
  }

  async findAll(): Promise<ApiResponseListDto<User>> {
    const userList: User[] = await this.userRepository.find({
      select: {
        password: false
      }
    });
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

  async findOne(id: number): Promise<ApiResponseObjectDto<User>> {
    const userFound: User = await this.userRepository.findOne({
      where: {
        userId: id
      },
      select: {
        password: false
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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ApiResponseObjectDto<string>> {
    const updatedUser: UpdateResult = await this.userRepository.update({
      userId: id
    }, {
      ...updateUserDto
    });
    if (!updatedUser.affected) {
      throw new NotFoundException('User not found', {
        description: 'There was an error while updating the user'
      });
    }
    return {
      'message': 'User values updated successfully',
      'detail': ''
    };
  }

  async remove(id: number, updateStatusDTO: UpdateStatusUserDto): Promise<ApiResponseObjectDto<string>> {
    const deletedUser: UpdateResult = await this.userRepository.update({
      userId: id
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
    return {
      'message': 'User removed successfully',
      'detail': ''
    };
  }

  async restore(id: number, updateStatusDTO: UpdateStatusUserDto): Promise<ApiResponseObjectDto<string>> {
    const restoredUser: UpdateResult = await this.userRepository.update({
      userId: id
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
    return {
      'message': 'User restored successfully',
      'detail': ''
    };
  }
}
