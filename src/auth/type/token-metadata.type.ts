import { UserType } from "@app/common";

export type TokenMetadata = {
  sub: number;
  iat: number;
  exp: number;
  userType: UserType
};
