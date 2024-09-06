import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import path from 'path';

// Load proto file
const protoPath = path.resolve(__dirname, '../src/proto/roles.proto');
const packageDefinition = loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load gRPC package
const grpcObject = loadPackageDefinition(packageDefinition);
const rolePackage = grpcObject.roles;

// Create gRPC client
export const roleClient = new (rolePackage as any).RoleService(
  'localhost:50052', // RoleService URL
  credentials.createInsecure()
);
