import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeyManagementModule } from './module/key-management/key-management.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Key } from './module/key-management/entities/key.entity'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'access_management',
      entities: [Key],
      synchronize: true,
    }),
    KeyManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
