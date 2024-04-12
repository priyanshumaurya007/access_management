import { Controller, Post, Body, Get, Param, Delete, Logger, NotFoundException, HttpException, HttpStatus, Put } from '@nestjs/common';
import { KeyManagementService } from './key-management.service';
import { Key } from './entities/key.entity';
import { UpdateKeyRequestPayload } from './dto/request-payload/update-key-request.payload'

@Controller('keys')
export class KeyManagementController {
  private readonly logger = new Logger(KeyManagementController.name);
  
  constructor(private readonly keyManagementService: KeyManagementService) {}

  @Post('/admin/login')
  async adminLogin(@Body() credentials: any): Promise<{ accessToken: string }> {
    const accessToken = await this.keyManagementService.adminLogin(credentials);
    return { accessToken };
  }

  @Post('/create')
  async createKey(@Body() data: any): Promise<Key> {
    const { userId, rateLimit, expirationMinutes } = data;
    return await this.keyManagementService.createKey(userId, rateLimit, expirationMinutes);
  }

  @Put('/:accessKey')
  async updateKey(@Param('accessKey') accessKey: string, @Body() UpdateKeyRequestPayload: UpdateKeyRequestPayload): Promise<{ message: string; key?: Key }> {
    try {
      const updatedKey = await this.keyManagementService.updateKey(accessKey, UpdateKeyRequestPayload);
      this.logger.log(`Key with access key ${accessKey} updated successfully`);
      return { message: 'Key updated', key: updatedKey };
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Key with access key ${accessKey} not found`);
        throw new HttpException('Key not found', HttpStatus.NOT_FOUND);
      } else {
        this.logger.error(`Failed to update key with access key ${accessKey}`);
        this.logger.error(error);
        throw error;  
      }
    }
  }

  @Delete('/:accessKey')
  async deleteKey(@Param('accessKey') accessKey: string): Promise<{ message: string; key?: Key }> {
    try {
      const deletedKey = await this.keyManagementService.deleteKey(accessKey);
      this.logger.log(`Key with access key ${accessKey} deleted successfully`);
      return { message: 'Key deleted', key: deletedKey };
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Key with access key ${accessKey} not found`);
        throw new HttpException('Key not found', HttpStatus.NOT_FOUND);
      } else {
        this.logger.error(`Failed to delete key with access key ${accessKey}`);
        this.logger.error(error);
        throw new HttpException('Failed to delete key', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get('/list')
  async listKeys(): Promise<Key[]> {
    return await this.keyManagementService.listKeys();
  }

  @Get('/:accessKey')
  async userPlan(@Param('accessKey') accessKey: string): Promise<Key> {
    return await this.keyManagementService.getUserPlanDetails(accessKey);
  }
}
