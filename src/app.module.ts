import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeyManagementModule } from './module/key-management/key-management.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Key } from './module/key-management/entities/key.entity'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Specify the database type as 'postgres'
      host: 'localhost', // Replace with your PostgreSQL host
      port: 5432, // Replace with your PostgreSQL port
      username: 'postgres', // Replace with your PostgreSQL username
      password: 'root', // Replace with your PostgreSQL password
      database: 'access_management', // Replace with your PostgreSQL database name
      entities: [Key], // Specify entities to be used by TypeOrm
      synchronize: true, // Auto-create database schema (for development only)
    }),
    KeyManagementModule, // Import and include your KeyManagementModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
