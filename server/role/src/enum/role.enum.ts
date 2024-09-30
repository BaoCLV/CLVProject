import { registerEnumType } from "@nestjs/graphql";

export enum ClientRole {
  User = 'user',
  Admin = 'admin',
}

registerEnumType(ClientRole, {
  name: 'ClientRole',
});