import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BASE_URL, CORE, MAX_URL_PER_USER, NODE_ENV, PORT } from 'src/common/constants/constants';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Url } from './entities/url.entity';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(User, CORE)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Url, CORE)
    private readonly urlRepository: Repository<Url>,
    private configService: ConfigService
  ) { }

  async create(createUrlDto: CreateUrlDto) {
    const userFound: User = await this.userRepository.findOne({
      where: {
        userId: +createUrlDto.userId
      }
    })
    if (!userFound) {
      throw new NotFoundException({
        'message': 'There was an error while creating the url',
        'details': 'User not found'
      });
    }
    const previousUrls: Url[] = await this.urlRepository.find({
      where: {
        user: {
          userId: +createUrlDto.userId
        }
      }
    });
    if (previousUrls?.length + 1 > MAX_URL_PER_USER) {
      throw new InternalServerErrorException({
        'message': 'There was an error while fetching urls',
        'details': 'You have reached the limit for creating more short URLs.'
      });
    }
    const randomUUID: string = this.generateRandomUUID();
    const domain: string = this.configService.get<string>(NODE_ENV) === 'local' ?
      `${this.configService.get<string>(BASE_URL)}:${this.configService.get<string>(PORT)}` :
      `${this.configService.get<string>(BASE_URL)}`;
    const url: Url = this.urlRepository.create({
      ...createUrlDto,
      uuid: randomUUID,
      shortUrl: `${domain}/${randomUUID}`,
      clickNro: 0,
      user: userFound
    });
    const { ...createdUrl } = await this.urlRepository.save({
      ...url
    });
    if (!createdUrl.urlId) {
      throw new InternalServerErrorException({
        'message': 'There was an error while creating the url',
        'details': 'Internal server error'
      });
    }
    return {
      'message': 'Url created successfully',
      'details': createdUrl.shortUrl
    };
  }

  async findAll() {
    const urlList: Url[] = await this.urlRepository.find({
      loadRelationIds: {
        relations: ['user'],
        disableMixedMap: true
      }
    });
    if (!urlList) {
      throw new InternalServerErrorException({
        'message': 'There was an error while fetching urls',
        'details': 'Internal server error'
      });
    }
    return {
      'message': 'Url data retrieved successfully',
      'details': urlList
    };
  }

  async findAllByUserId(userId: number) {
    const urlList: Url[] = await this.urlRepository.find({
      loadRelationIds: {
        relations: ['user'],
        disableMixedMap: true
      },
      where: {
        user: {
          userId: userId
        }
      }
    });
    if (!urlList) {
      throw new InternalServerErrorException({
        'message': 'There was an error while fetching urls',
        'details': 'Internal server error'
      });
    }
    return {
      'message': 'Url data retrieved successfully',
      'details': urlList
    };
  }

  async findOne(id: number) {
    const urlFound: Url = await this.urlRepository.findOne({
      loadRelationIds: {
        relations: ['user'],
        disableMixedMap: true
      },
      where: {
        urlId: id
      }
    });
    if (!urlFound) {
      throw new NotFoundException({
        'message': 'There was an error while fetching url',
        'details': 'Url not found'
      });
    }
    return {
      'message': 'Url data retrieved successfully',
      'details': urlFound
    };
  }

  async update(id: number, updateUrlDto: UpdateUrlDto) {
    const updatedUrl: UpdateResult = await this.urlRepository.update({
      urlId: id
    }, {
      ...updateUrlDto
    });
    if (!updatedUrl.affected) {
      throw new NotFoundException({
        'message': 'There was an error while updating the url',
        'details': 'Url not found'
      });
    }
    return {
      'message': 'Url values updated successfully',
      'details': null
    };
  }

  async remove(uuid: string) {
    const deletedUrl: DeleteResult = await this.urlRepository.delete({
      uuid: uuid
    });
    if (!deletedUrl.affected) {
      throw new NotFoundException({
        'message': 'There was an error while deleting the url',
        'details': 'Url not found'
      });
    }
    return {
      'message': 'Url deleted successfully',
      'details': null
    };
  }

  private generateRandomUUID(length: number = 10): string {
    const finalLength: number = length > 10 ? 10 : length;
    const randomUUID = crypto.randomUUID().replaceAll('-', '').substring(0, finalLength);
    return randomUUID;
  }
}
