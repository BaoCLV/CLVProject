import { registerEnumType } from "@nestjs/graphql";

export enum ClientRole {
  User = 'user',
  Admin = 'admin',
   SuperAdmin = 'Super Admin'
}

registerEnumType(ClientRole, {
  name: 'ClientRole',
});