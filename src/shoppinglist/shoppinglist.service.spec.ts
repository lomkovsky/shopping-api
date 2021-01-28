import { Test, TestingModule } from '@nestjs/testing';
import { ShoppinglistService } from './shoppinglist.service';

describe('ShoppinglistService', () => {
  let service: ShoppinglistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShoppinglistService],
    }).compile();

    service = module.get<ShoppinglistService>(ShoppinglistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
