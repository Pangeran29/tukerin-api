import { CurrentUser } from '@app/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as crypto from 'crypto'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async getAccessToken(payloadAccessToken: CurrentUser) {
    try {
      const accessToken = await this.jwtService.signAsync(payloadAccessToken);
      return { type: 'bearer', accessToken };
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

  async jwtSignAsync(payload: any, options?: JwtSignOptions) {
    try {
      return await this.jwtService.signAsync(payload, options);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Fail to create JWT token',
        jwtError: error,
      });
    }
  }

  async jwtVerifyAsync(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Fail to verify JWT token. Token either expired or malformed',
        jwtError: error,
      });
    }
  }

  async encrypt() {
    cryp
    const encryptedData = crypto.publicEncrypt(
      {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
      },
      Buffer.from(data)
  );
  }
}
