import { PartialType } from '@nestjs/mapped-types';
import { CreateShoppinglistDto } from './create-shoppinglist.dto';

export class UpdateShoppinglistDto extends PartialType(CreateShoppinglistDto) {}
