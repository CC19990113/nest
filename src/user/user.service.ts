import { HttpException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BcryptService } from 'src/utils/bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { RedisCacheService } from '../utils/RedisCacheService';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly redisCacheService: RedisCacheService,
  ) {}
  async register(createUserDto: RegisterUserDto) {
    const { username, password } = createUserDto;
    if (!username) {
      throw new HttpException('用户名不能为空', 401);
    }
    if (username.length < 4 || username.length > 16) {
      throw new HttpException('用户名长度不合法,应为4-16位之间', 401);
    }
    if (!/[0-9A-Za-z]{4,16}$/.test(username)) {
      throw new HttpException('用户名不合法,只能包含字母和数字', 401);
    }
    if (!password) {
      throw new HttpException('密码不能为空', 401);
    }
    if (password.length < 6 || password.length > 16) {
      throw new HttpException('密码长度不合法,应为6-16位之间', 401);
    }
    if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(password)) {
      throw new HttpException('密码不合法,密码应为6-16位字母和数字组成', 401);
    }
    // 查询是否存在相同的用户名
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('username=:username', { username })
      .getOne();
    // 抛出异常 if 用户名已存在
    if (user) {
      throw new HttpException('用户名已存在', 401);
    }
    // 将密码进行哈希处理
    createUserDto.password = await BcryptService.hash(password);
    // 保存用户信息
    await this.userRepository.save(createUserDto);
    return {
      message: '注册成功',
      code: 200,
    };
  }
  async login(createUserDto: LoginUserDto) {
    const { username, password } = createUserDto;
    if (!username) {
      throw new HttpException('用户名不能为空', 401);
    }
    if (!password) {
      throw new HttpException('密码不能为空', 401);
    }
    // 查询用户信息
    const user = this.userRepository
      .createQueryBuilder('user')
      .where('username=:username', { username })
      .getOne();
    if (!user) {
      throw new HttpException('用户名不存在', 401);
    }
    await this.redisCacheService.set('name', '123', 3600);
    console.log(await this.redisCacheService.get('name'));
    return {
      message: '登录成功',
      code: 200,
    };
  }
}
