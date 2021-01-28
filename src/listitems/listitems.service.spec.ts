import { Test, TestingModule } from '@nestjs/testing';
import { ListitemsService } from './listitems.service';

describe('ListitemsService', () => {
  let service: ListitemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListitemsService],
    }).compile();

    service = module.get<ListitemsService>(ListitemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
