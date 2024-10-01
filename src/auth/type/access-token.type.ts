import { UserType } from "@app/common";

export type AccessToken = {
  type: string;
  accessToken: string;
  userType: UserType;
};
