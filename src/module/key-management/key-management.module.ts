import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyManagementController } from './key-management.controller';
import { KeyManagementService } from './key-management.service';
import { Key } from './entities/key.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Key])
  ],
  controllers: [KeyManagementController],
  providers: [KeyManagementService],
})

export class KeyManagementModule {}
