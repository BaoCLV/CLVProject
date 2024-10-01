// import { Controller } from '@nestjs/common';
// import { GrpcMethod } from '@nestjs/microservices';
// import { RoleService } from './roles.service';
// import { CreateRoleDto, UpdateRoleDto } from 'src/dto/role.dto';


// @Controller()
// export class RoleController {
//   constructor(private readonly roleService: RoleService) {}

//   @GrpcMethod('RoleService', 'CreateRole')
//   async createRole(data: CreateRoleDto) {
//     console.log('Data received in gRPC:', data); // Log the data received in the gRPC method
//     // if (!data.startLocation || !data.endLocation) {
//     //   return { error: 'Start location and end location are required' };
//     // }
//     const newRole = await this.roleService.create(data);
//     return { id: newRole.id, message: 'Role created successfully!' };
//   }

//   @GrpcMethod('RoleService', 'FindAllRoles')
//   async findAllRoles() {
//     try {
//       const roles = await this.roleService.findAll({});
//       return { roles };
//     } catch (error) {
//       return { error: error.message };
//     }
//   }

//   @GrpcMethod('RoleService', 'FindOneRole')
//   async findOneRole(data: { id: number }) {
//     try {
//       const role = await this.roleService.findOneById(data.id);
//       return { role };
//     } catch (error) {
//       return { error: error.message };
//     }
//   }

//   @GrpcMethod('RoleService', 'UpdateRole')
//   async updateRole(data: UpdateRoleDto & { id: number }) {
//     try {
//       const updatedRole = await this.roleService.updateById(data.id, data);
//       return { role: updatedRole, message: 'Role updated successfully!' };
//     } catch (error) {
//       return { error: error.message };
//     }
//   }

//   @GrpcMethod('RoleService', 'DeleteRole')
//   async deleteRole(data: { id: number }) {
//     try {
//       await this.roleService.removeById(data.id);
//       return { message: 'Role deleted successfully!' };
//     } catch (error) {
//       return { error: error.message };
//     }
//   }
// }
