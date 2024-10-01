import { User as IUser } from "@prisma/client";

export class User implements IUser {
  id: number;
  phoneNumber: string;
  email: string;
  name: string;
  password: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}
