import { Test, TestingModule } from '@nestjs/testing';
import { ShoppinglistController } from './shoppinglist.controller';
import { ShoppinglistService } from './shoppinglist.service';

describe('ShoppinglistController', () => {
  let controller: ShoppinglistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppinglistController],
      providers: [ShoppinglistService],
    }).compile();

    controller = module.get<ShoppinglistController>(ShoppinglistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
