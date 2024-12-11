import { SetMetadata } from "@nestjs/common";
import { ERole } from "@prisma/client";

export const Roles = (...roles: ERole[]) => SetMetadata("roles", roles);
