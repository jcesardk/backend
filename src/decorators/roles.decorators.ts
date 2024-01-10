import {RoleEnum} from "../enums/role.enum";
import {SetMetadata} from "@nestjs/common";

export const ROLES_ENUM_KEY = "rolesEnum";
export const Roles = (...rolesEnum: RoleEnum[]) => SetMetadata(ROLES_ENUM_KEY, rolesEnum)