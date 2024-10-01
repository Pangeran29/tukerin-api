import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccessToken } from './type/access-token.type';
import { UserType } from '@app/common';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async getAccessToken(userId: number, userType: UserType): Promise<AccessToken> {
    const accessTokenPayload = { sub: userId, userType };
    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload);
      return { type: 'bearer', accessToken, userType };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Fail to create access token',
        jwtError: error,
      });
    }
  }

  async hash(data: any): Promise<string> {
    const saltOrRounds = 10;
    try {
      return await bcrypt.hash(data, saltOrRounds);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Fail to hash password',
        bcryptError: error,
      });
    }
  }

  async compareHashed(data: any, hashedData: string): Promise<boolean> {
    try {
      return await bcrypt.compare(data, hashedData);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Fail to compare password',
        bcryptError: error,
      });
    }
  }
}
