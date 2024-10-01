import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
// import path from 'path';
import * as path from 'path';


// Load proto file
const protoPath = path.resolve(__dirname, '../../src/protos/user.proto');
const packageDefinition = loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load gRPC package
const grpcObject = loadPackageDefinition(packageDefinition);
const userPackage = grpcObject.user;

// Create gRPC client
export const roleClient = new (userPackage as any).UserService(
  'localhost:50052', // RoleService URL
  credentials.createInsecure()
);
