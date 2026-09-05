import { DevicesRepository } from './devices.repository.js';
import { RegisterDeviceDto, UnregisterDeviceDto } from './devices.dto.js';

export class DevicesService {
  constructor(private devicesRepo = new DevicesRepository()) {}

  async registerDevice(userId: number, dto: RegisterDeviceDto) {
    await this.devicesRepo.registerOrUpdateToken(userId, dto.tokenDispositivo, dto.plataforma);
    return { registered: true };
  }

  async unregisterDevice(userId: number, dto: UnregisterDeviceDto) {
    await this.devicesRepo.deactivateToken(dto.tokenDispositivo, userId);
    return { unregistered: true };
  }
}
