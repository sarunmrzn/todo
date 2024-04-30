import axios from "axios";
import { Todo } from "./components/Todo/types";

const URL = process.env.REACT_APP_API_URL;
const suffix = "/todos";
const todoUrl = URL + suffix;

const fetchTodos = async (filter: string = "all") => {
  try {
    const response = await axios.get<Todo[]>(todoUrl + `?filter=${filter}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch todos:", error);
  }
};

const addTodo = async (name: string, description: string, dateTime: string) => {
  try {
    await axios
      .post(todoUrl, {
        name,
        description,
        dateTime,
        done: false,
      })
      .then(() => fetchTodos());
  } catch (error) {
    console.error("Failed to add todo:", error);
  }
};

const updateTodo = async (
  id: string,
  completed?: boolean,
  name?: string,
  description?: string,
  dateTime?: string,
) => {
  try {
    await axios
      .patch(`${todoUrl}/${id}`, {
        name,
        description,
        dateTime,
        completed,
      })
      .then(() => fetchTodos());
  } catch (error) {
    console.error("Failed to update todo:", error);
  }
};

const deleteTodo = async (id: string) => {
  try {
    await axios.delete(`${todoUrl}/${id}`).then(() => fetchTodos());
  } catch (error) {
    console.error("Failed to delete todo:", error);
  }
};

export { fetchTodos, addTodo, updateTodo, deleteTodo };
