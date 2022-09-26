import { Test, TestingModule } from '@nestjs/testing';
import { WalletConnectService } from './walletconnect.service';

describe('WalletconnectService', () => {
  let service: WalletConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletConnectService],
    }).compile();

    service = module.get<WalletConnectService>(WalletConnectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
