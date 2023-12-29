import { ApiProperty, PartialType } from '@nestjs/swagger';
import { RegisterUserDto } from './register-user.dto';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto extends PartialType(RegisterUserDto) {
  @IsNotEmpty()
  @MinLength(4, { message: '用户名长度不能少于4位' })
  @MaxLength(16, { message: '用户名长度不能超过16位' })
  @ApiProperty({
    description: '用户名',
    example: 'JohnDoe',
    required: true,
    type: String,
  })
  @IsString({ message: '用户名必须是字符串' })
  readonly username: string;

  @IsNotEmpty()
  @MinLength(6, { message: '密码长度不能少于6位' })
  @MaxLength(16, { message: '密码长度不能超过16位' })
  @ApiProperty({
    description: '密码',
    example: '123456',
    required: true,
    type: String,
  })
  password: string;
}
