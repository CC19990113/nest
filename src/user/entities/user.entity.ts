import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BcryptService } from '../../utils/bcrypt';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn({
    comment: '用户id',
  })
  id: number;

  @Column({
    comment: '用户名',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  username: string;

  @Column({
    comment: '用户密码',
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false,
  })
  password: string;

  @Column({
    comment: '创建时间',
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    comment: '更新时间',
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  /**
   * 使用装饰器@BeforeInsert来装饰encryptPwd方法，表示该方法在数据插入之前调用，这样就能保证插入数据库的密码都是加密后的。
   */
  @BeforeInsert()
  async encryptPwd() {
    this.password = await BcryptService.hash(this.password);
  }
}
