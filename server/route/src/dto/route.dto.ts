import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

  export class CreateRouteDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsEmail()
    @IsNotEmpty()
    start_location: string;
  
    @IsString()
    @IsNotEmpty()
    end_location: string;

    @IsString()
    @IsNotEmpty()
    distance: number;
  }
  
  export class UpdateRouteDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsEmail()
    @IsNotEmpty()
    start_location: string;
  
    @IsString()
    @IsNotEmpty()
    end_location: string;

    @IsString()
    @IsNotEmpty()
    distance: number;
  }

  export class RouteDto {
    readonly id: number;
    readonly name: string;
    readonly distance: number;
  }
  