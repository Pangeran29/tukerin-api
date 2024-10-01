import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenMetadata } from '../type/token-metadata.type';
import { UserService } from 'src/user/user.service';
import { CmsUserService } from 'src/cms-user/cms-user.service';
import { CurrentUser } from '@app/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly cmsUserService: CmsUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(tokenMetadata: TokenMetadata) {
    if (!tokenMetadata.userType) {
      throw new UnauthorizedException('Token not valid');
    }

    let currentUser: CurrentUser;
    if (tokenMetadata.userType === 'user') {
      const user = await this.userService.findById(tokenMetadata.sub);
      if (!user) {
        throw new NotFoundException('Not found user at token provided');
      }
      currentUser = { userType: 'user', user };
    } else if (tokenMetadata.userType === 'cms') {
      const user = await this.cmsUserService.findById(tokenMetadata.sub);
      if (!user) {
        throw new NotFoundException('Not found user at token provided');
      }
      currentUser = { userType: 'cms', user };
    } else {
      throw new UnauthorizedException('Token not valid');
    }

    return currentUser;
  }
}
