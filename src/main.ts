import { NestFactory } from '@nestjs/core'; // 导入NestFactory类
import { AppModule } from './app.module'; // 导入AppModule类
import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter'; // 导入HttpExceptionFilter类
import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor'; // 导入TransformInterceptor类
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common'; // 导入DocumentBuilder和SwaggerModule类

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // 创建NestFactory实例并使用AppModule类创建应用
  app.useGlobalFilters(new HttpExceptionFilter()); // 使用HttpExceptionFilter类作为全局过滤器
  app.useGlobalInterceptors(new TransformInterceptor()); // 使用TransformInterceptor类作为全局拦截器
  app.setGlobalPrefix('/api/v1'); // 设置全局接口前缀为'/api/v1'
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder() // 创建DocumentBuilder实例
    .setTitle('管理后台') // 设置接口文档标题为'管理后台'
    .setDescription('管理后台接口文档') // 设置接口文档描述为'管理后台接口文档'
    .setVersion('1.0') // 设置接口文档版本为'1.0'
    .addBearerAuth() // 添加Bearer认证
    .build(); // 生成接口文档配置

  const document = SwaggerModule.createDocument(app, config); // 使用SwaggerModule类创建接口文档
  SwaggerModule.setup('docs', app, document); // 配置SwaggerUI实例，将接口文档暴露在'./docs'路径下

  await app.listen(3000); // 监听3000端口启动应用
}

bootstrap(); // 启动应用
