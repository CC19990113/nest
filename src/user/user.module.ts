import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { UserLoginAuth } from '../utils/local.strategy';
import { RedisCacheService } from '../utils/RedisCacheService';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), PassportModule],
  controllers: [UserController],
  providers: [UserService, UserLoginAuth, RedisCacheService],
  exports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserModule {}
