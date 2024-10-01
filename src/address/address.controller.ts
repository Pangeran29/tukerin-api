import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, GetCurrentUser, JwtAuthGuard } from '@app/common';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Address Management')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(
    @GetCurrentUser() currentUser: CurrentUser,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressService.create(
      createAddressDto.intoAddress(currentUser.user.id),
    );
  }

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const address = await this.addressService.findOne(id);
    return this.addressService.update(
      updateAddressDto.intoUpdateAddress(address.id),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }

  @Patch('set-active-address/:id')
  async setActiveAddress(@Param('id') id: number) {
    const oldActiveAddress = await this.addressService.findActiveAddress();
    const newActiveAddress = await this.addressService.findOne(id);

    return await this.addressService.updateActiveAddress(
      newActiveAddress.id,
      oldActiveAddress?.id,
    );
  }
}
