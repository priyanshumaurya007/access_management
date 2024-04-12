import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyManagementController } from './key-management.controller';
import { KeyManagementService } from './key-management.service';
import { Key } from './entities/key.entity'
import { JwtModule } from '@nestjs/jwt';
import { JwtMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
      JwtModule.register({
      secret: 'my_secret',
      signOptions: { expiresIn: '1h' },
    }),
      TypeOrmModule.forFeature([Key])
  ],
  controllers: [KeyManagementController],
  providers: [KeyManagementService],
})

export class KeyManagementModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware)
    .exclude(
      { path: 'keys/admin/login', method: RequestMethod.POST }
    )
    .forRoutes(KeyManagementController);
  }
}
