import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './todos.schema';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>,
  ) {}
  async create(todoDto: CreateTodoDto): Promise<Todo> {
    const createdTodo = new this.todoModel(todoDto);
    return await createdTodo.save();
  }

  async findAll(filter: string): Promise<Todo[]> {
    const filters = {};
    if (filter === 'done') {
      filters['done'] = true;
    }
    if (filter === 'upcoming') {
      filters['dateTime'] = {
        $gte: new Date(),
      };
    }
    return await this.todoModel.find(filters).exec();
  }

  async update(id: string, todoDto: UpdateTodoDto): Promise<Todo> {
    const updatedTodo = await this.todoModel.findById(id);
    if (todoDto.name) {
      updatedTodo.name = todoDto.name;
    }
    if (todoDto.description) {
      updatedTodo.description = todoDto.description;
    }
    if (todoDto.dateTime) {
      updatedTodo.dateTime = todoDto.dateTime;
    }
    if (typeof todoDto.completed === 'boolean') {
      updatedTodo.done = todoDto.completed;
    }
    return updatedTodo.save();
  }

  async delete(id: string): Promise<any> {
    return await this.todoModel.findByIdAndDelete(id);
  }
}
