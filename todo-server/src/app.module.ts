import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://sarun:pass@localhost:27017/'),
    TodosModule,
  ],
})
export class AppModule {}
