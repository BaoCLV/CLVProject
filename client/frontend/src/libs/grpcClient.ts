import { credentials } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// Load the proto definition
const PROTO_PATH = path.resolve('../../protos/route.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load the package definition and extract the service
const routeProto = grpc.loadPackageDefinition(packageDefinition).route as any;

// Ensure correct service client usage
const client = new routeProto.RouteService('localhost:4000', credentials.createInsecure());

export default client;

// Ensure you export types if needed separately
export {
 RouteServiceControllerMethods
} from '../../../../server/route/src/protos/route';
