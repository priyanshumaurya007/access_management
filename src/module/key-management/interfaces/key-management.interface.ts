import { Key } from '../entities/key.entity';
import { UpdateKeyRequestPayload } from '../dto/request-payload/update-key-request.payload';

export interface KeyManagementServiceInterface {
  adminLogin(credentials: any);
  createKey(userId: string, rateLimit: number, expirationMinutes: number): Promise<Key>;
  updateKey(accessKey: string, UpdateKeyRequestPayload: UpdateKeyRequestPayload): Promise<Key>;
  deleteKey(accessKey: string): Promise<Key>;
  listKeys(): Promise<Key[]>;
  getUserPlanDetails(userId: string): Promise<Key[]>;
}
