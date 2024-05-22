// src/module/key-management/key-management.module.ts
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyManagementController } from './key-management.controller';
import { KeyManagementService } from './key-management.service';
import { Key } from './entities/key.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
        signOptions: { expiresIn: '1h' },
      }),
    }),
    TypeOrmModule.forFeature([Key]),
  ],
  controllers: [KeyManagementController],
  providers: [KeyManagementService],
})
export class KeyManagementModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'keys/admin/login', method: RequestMethod.POST },
        { path: 'keys/:accessKey', method: RequestMethod.GET }
      )
      .forRoutes(KeyManagementController);
  }
}
