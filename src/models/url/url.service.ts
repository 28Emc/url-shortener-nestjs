import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BASE_URL, CORE, MAX_URL_PER_USER, NODE_ENV, PORT } from 'src/common/constants/constants';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Url } from './entities/url.entity';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { UpdateUrlCountsDto } from './dto/update-url-counts.dto';
import { ApiResponseListDto, ApiResponseObjectDto } from 'src/common/dtos/api-response.dto';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(User, CORE)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Url, CORE)
    private readonly urlRepository: Repository<Url>,
    private configService: ConfigService
  ) { }

  async create(createUrlDto: CreateUrlDto): Promise<ApiResponseObjectDto<string>> {
    const userFound: User = await this.userRepository.findOne({
      where: {
        uuid: createUrlDto.userUUID
      }
    })
    if (!userFound) {
      throw new NotFoundException({
        'message': 'There was an error while creating the url',
        'detail': 'User not found'
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
        'detail': 'Internal server error'
      });
    }
    return {
      'message': 'Url created successfully',
      'detail': createdUrl.shortUrl
    };
  }

  async createByUser(createUrlDto: CreateUrlDto): Promise<ApiResponseObjectDto<string>> {
    const userFound: User = await this.userRepository.findOne({
      where: {
        uuid: createUrlDto.userUUID
      }
    })
    if (!userFound) {
      throw new NotFoundException({
        'message': 'There was an error while creating the url',
        'detail': 'User not found'
      });
    }
    const previousUrls: Url[] = await this.urlRepository.find({
      where: {
        user: {
          uuid: createUrlDto.userUUID
        }
      }
    });
    if (previousUrls?.length + 1 > MAX_URL_PER_USER) {
      throw new InternalServerErrorException({
        'message': 'There was an error while fetching urls',
        'detail': 'You have reached the limit for creating more short URLs.'
      });
    }
    const randomUUID: string = this.generateRandomUUID(7);
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
        'detail': 'Internal server error'
      });
    }
    return {
      'message': 'Url created successfully',
      'detail': createdUrl.shortUrl
    };
  }

  async findAll(): Promise<ApiResponseListDto<Url>> {
    const urlList: Url[] = await this.urlRepository.find({
      loadRelationIds: {
        relations: ['user'],
        disableMixedMap: true
      }
    });
    if (!urlList) {
      throw new InternalServerErrorException({
        'message': 'There was an error while fetching urls',
        'detail': 'Internal server error'
      });
    }
    return {
      'message': 'Url data retrieved successfully',
      'detail': urlList
    };
  }

  async findAllByUserUUID(uuid: string): Promise<ApiResponseListDto<Url>> {
    const urlList: Url[] = await this.urlRepository.find({
      loadRelationIds: {
        relations: ['user'],
        disableMixedMap: true
      },
      where: {
        user: {
          uuid: uuid
        }
      }
    });
    if (!urlList) {
      throw new InternalServerErrorException({
        'message': 'There was an error while fetching urls',
        'detail': 'Internal server error'
      });
    }
    return {
      'message': 'Url data retrieved successfully',
      'detail': urlList
    };
  }

  async findOne(id: number): Promise<ApiResponseObjectDto<Url>> {
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
        'detail': 'Url not found'
      });
    }
    return {
      'message': 'Url data retrieved successfully',
      'detail': urlFound
    };
  }

  async findOneByUUID(uuid: string): Promise<ApiResponseObjectDto<Url>> {
    const urlFound: Url = await this.urlRepository.findOne({
      loadRelationIds: {
        relations: ['user'],
        disableMixedMap: true
      },
      where: {
        uuid: uuid
      }
    });
    if (!urlFound) {
      throw new NotFoundException({
        'message': 'There was an error while fetching url',
        'detail': 'Url not found'
      });
    }
    return {
      'message': 'Url data retrieved successfully',
      'detail': urlFound
    };
  }

  async update(id: number, updateUrlDto: UpdateUrlDto): Promise<ApiResponseObjectDto<string>> {
    const updatedUrl: UpdateResult = await this.urlRepository.update({
      urlId: id
    }, {
      ...updateUrlDto
    });
    if (!updatedUrl.affected) {
      throw new NotFoundException({
        'message': 'There was an error while updating the url',
        'detail': 'Url not found'
      });
    }
    return {
      'message': 'Url values updated successfully',
      'detail': ''
    };
  }

  async updateCounts(updateUrlCountsDto: UpdateUrlCountsDto): Promise<ApiResponseObjectDto<{ urlId: number, originalUrl: string }>> {
    const urlFound: Url = await this.urlRepository.findOne({
      where: {
        uuid: updateUrlCountsDto.uuid
      }
    });
    if (!urlFound) {
      throw new NotFoundException({
        'message': 'There was an error while updating the url',
        'detail': 'Url not found'
      });
    }
    const finalCount: number = updateUrlCountsDto.clickNro === 1 ? urlFound.clickNro + 1 : updateUrlCountsDto.clickNro;
    const updatedUrl: UpdateResult = await this.urlRepository.update({
      urlId: urlFound.urlId
    }, {
      clickNro: finalCount
    });
    if (!updatedUrl.affected) {
      throw new InternalServerErrorException({
        'message': 'There was an error while updating the url',
        'detail': 'Internal server error'
      });
    }
    return {
      'message': 'Url values updated successfully',
      'detail': {
        urlId: +urlFound.urlId,
        originalUrl: urlFound.originalUrl
      }
    };
  }

  async remove(code: string): Promise<ApiResponseObjectDto<string>> {
    const deletedUrl: DeleteResult = await this.urlRepository.delete({
      uuid: code
    });
    if (!deletedUrl.affected) {
      throw new NotFoundException({
        'message': 'There was an error while deleting the url',
        'detail': 'Url not found'
      });
    }
    return {
      'message': 'Url deleted successfully',
      'detail': deletedUrl.affected.toString()
    };
  }

  private generateRandomUUID(length: number = 10): string {
    const finalLength: number = length > 10 ? 10 : length;
    const randomUUID = crypto.randomUUID().replaceAll('-', '').substring(0, finalLength);
    return randomUUID;
  }
}
