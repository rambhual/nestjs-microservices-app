import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { Types } from 'mongoose';
import { UserDocument } from './models/user.schema';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      await this.validateCreateUser(createUserDto.email);
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      return await this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async verifyUser(
    email: string,
    password: string,
  ): Promise<{ _id: Types.ObjectId }> {
    const user = await this.userRepository.findOne({ email });
    if (!user && (await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('credentials are not valid');
    }
    return { _id: user._id };
  }

  async getUserId(user: GetUserDto) {
    return await this.userRepository.findOne({ _id: user._id });
  }

  private async validateCreateUser(email: string) {
    try {
      await this.userRepository.findOne({ email });
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists');
  }
}
