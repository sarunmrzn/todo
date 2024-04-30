import React, { useEffect, useState } from "react";
import { addTodo, deleteTodo, fetchTodos, updateTodo } from "./api";
import AddTodo from "./components/Todo/Add";
import TodoItem from "./components/Todo/Item";
import { Todo } from "./components/Todo/types";

enum FilterState {
  ALL = "all",
  DONE = "done",
  UPCOMING = "upcoming",
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterState>(FilterState.ALL);
  console.log(todos);

  const getTodos = (filter: FilterState = FilterState.ALL) => {
    fetchTodos(filter).then((data) => data && setTodos(data));
  };

  useEffect(() => {
    getTodos(filter);
  }, [filter]);

  const onAdd = async (name: string, description: string, dateTime: string) => {
    addTodo(name, description, dateTime).then(() => getTodos());
  };

  const onDelete = async (id: string) => {
    deleteTodo(id).then(() => getTodos());
  };

  const onUpdate = async (
    id: string,
    name: string,
    description: string,
    dateTime: string,
  ) => {
    updateTodo(id, false, name, description, dateTime).then(() => getTodos());
  };

  const onComplete = async (id: string) => {
    updateTodo(id, true).then(() => getTodos());
  };

  return (
    <div className="mx-auto p-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center mb-4">Todo List</h1>
      <AddTodo onAdd={onAdd} />
      <div className="flex mb-2">
        {["All", "Done", "Upcoming"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item.toLowerCase() as FilterState)}
            className={`${item.toLowerCase() === filter ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-2 rounded-md mr-2`}
          >
            {item}
          </button>
        ))}
      </div>
      <div>
        {todos?.length > 0 ? (
          todos.map((todo) => {
            return (
              <TodoItem
                key={todo._id}
                todo={todo}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onComplete={onComplete}
              />
            );
          })
        ) : (
          <div className="text-4xl italic">No Todos found</div>
        )}
      </div>
    </div>
  );
};

export default App;
