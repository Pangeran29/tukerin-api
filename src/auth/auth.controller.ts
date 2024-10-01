import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { CurrentUser, GetCurrentUser, JwtAuthGuard } from '@app/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { CmsRegisterDto } from './dto/cms-register.dto';
import { CmsUserService } from 'src/cms-user/cms-user.service';
import { CmsLoginDto } from './dto/cms-login.dto';
import { User } from 'src/user/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly cmsUserService: CmsUserService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    {
      const userEmail = await this.userService.findByEmail(registerDto.email);
      if (userEmail) {
        throw new BadRequestException("User's email already registered");
      }

      const userPhoneNumber = await this.userService.findByEmail(
        registerDto.email,
      );
      if (userPhoneNumber) {
        throw new BadRequestException("User's phone number already registered");
      }
    }

    const hashedPassword = await this.authService.hash(registerDto.password);
    registerDto.setPassword(hashedPassword);

    return await this.userService.create(registerDto.intoUser());
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException("User's email is not registered");
    }

    const validatePassword = await this.authService.compareHashed(
      loginDto.password,
      user.password,
    );
    if (!validatePassword) {
      throw new UnauthorizedException("User's password is not valid");
    }

    const token = await this.authService.getAccessToken(user.id, 'user');
    return { user, token };
  }

  @Post('cms-register')
  async cmsRegister(@Body() cmsRegisterDto: CmsRegisterDto) {
    {
      const userEmail = await this.cmsUserService.findByEmail(
        cmsRegisterDto.email,
      );
      if (userEmail) {
        throw new BadRequestException("User's email already registered");
      }

      const userPhoneNumber = await this.cmsUserService.findByEmail(
        cmsRegisterDto.email,
      );
      if (userPhoneNumber) {
        throw new BadRequestException("User's phone number already registered");
      }
    }

    const hashedPassword = await this.authService.hash(cmsRegisterDto.password);
    cmsRegisterDto.setPassword(hashedPassword);

    return await this.cmsUserService.create(cmsRegisterDto.intoUser(), cmsRegisterDto.intoMerchant());
  }

  @Post('cms-login')
  async cmsLogin(@Body() cmsLoginDto: CmsLoginDto) {
    const user = await this.cmsUserService.findByEmail(cmsLoginDto.email);
    if (!user) {
      throw new UnauthorizedException("User's email is not registered");
    }

    const validatePassword = await this.authService.compareHashed(
      cmsLoginDto.password,
      user.password,
    );
    if (!validatePassword) {
      throw new UnauthorizedException("User's password is not valid");
    }

    const token = await this.authService.getAccessToken(user.id, 'cms');
    return { user, token };
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@GetCurrentUser() user: CurrentUser) {
    return user;
  }
}
