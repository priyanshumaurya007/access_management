import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Key } from './entities/key.entity';
import { UpdateKeyRequestPayload } from './dto/request-payload/update-key-request.payload'

@Injectable()
export class KeyManagementService {
  constructor(
    @InjectRepository(Key)
    private readonly keyRepository: Repository<Key>
  ) {}

  async adminLogin(credentials: any): Promise<string> {
    try {
      const { username, password } = credentials;
      const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
      const adminUsername = process.env.ADMIN_USERNAME;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (username === adminUsername && password === adminPassword) {
        const payload = { username };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        return token;
      } else {
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async createKey(userId: string, rateLimit: number, expirationMinutes: number): Promise<Key> {
    try {

      let key = await this.keyRepository.findOne({ where: { userId } });

      if(key) {
        throw new BadRequestException('Key already exist for given userId');
      }

      const expiration = new Date(Date.now() + expirationMinutes * 60 * 1000);
      key = new Key();
      key.userId = userId;
      key.key = this.generateKey();
      key.rateLimit = rateLimit;
      key.expiration = expiration;

      const savedKey = await this.keyRepository.save(key);
      savedKey.expiration = this.convertToIST(savedKey.expiration);
  
      return savedKey;
    } catch (error) {
      throw error;
    }
  }
  
  async deleteKey(accessKey: string): Promise<Key> {
    try {
      const key = await this.keyRepository.findOne({ where: { key: accessKey } });
      if (!key) {
        throw new NotFoundException('Key not found');
      }
      await this.keyRepository.remove(key);
      return key;
    } catch (error) {
      throw new Error('Failed to delete key');
    }
  }

  async updateKey(accessKey: string, UpdateKeyRequestPayload: UpdateKeyRequestPayload): Promise<Key> {
    try {
      const key = await this.keyRepository.findOne({ where: { key: accessKey } });
      if (!key) {
        throw new NotFoundException('Key not found');
      }

      if(UpdateKeyRequestPayload?.rateLimit === undefined && UpdateKeyRequestPayload?.expirationMinutes == undefined) {
        throw new BadRequestException('Please provide either rateLimit or expirationMinutes');

      }

      if (UpdateKeyRequestPayload?.rateLimit !== undefined) {
        key.rateLimit = UpdateKeyRequestPayload?.rateLimit;
      }
      
      if (UpdateKeyRequestPayload?.expirationMinutes !== undefined) {
        const expiration = new Date(Date.now() + UpdateKeyRequestPayload?.expirationMinutes * 60 * 1000);
        key.expiration = expiration;
      }

      return await this.keyRepository.save(key);
    } catch (error) {
      throw error;
    }
  }

  async listKeys(): Promise<Key[]> {
    try {
      return await this.keyRepository.find();
    } catch (error) {
      throw new Error('Failed to list keys');
    }
  }

  async getUserPlanDetails(accessKey: string): Promise<Key> {
    try {
      const key = await this.keyRepository.findOne({ where: { key: accessKey } });

      if (!key) {
        throw new NotFoundException('Key not found');
      }

      return key;

    } catch (error) {
      throw error;
    }
  }

  private generateKey(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private convertToIST(utcDate: Date): Date {
    const istOffset = 330 * 60000;
    const utcTime = utcDate.getTime();
    const istTime = utcTime + istOffset;
    return new Date(istTime);
  }
}
