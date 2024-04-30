import { IsNotEmpty, IsString, IsBoolean, IsDateString } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  dateTime: Date;

  @IsBoolean()
  completed: boolean;
}
