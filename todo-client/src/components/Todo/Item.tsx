import React, { useState } from "react";
import { Todo } from "./types";
import * as yup from "yup";

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  onUpdate: (
    id: string,
    name: string,
    description: string,
    dateTime: string,
  ) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDelete,
  onUpdate,
  onComplete,
}) => {
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState(todo.name);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [editedDateTime, setEditedDateTime] = useState(
    new Date(todo.dateTime).toISOString().slice(0, 16),
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const schema = yup.object().shape({
    editedName: yup.string().required("Name is required"),
    editedDescription: yup.string().required("Description is required"),
    editedDateTime: yup.string().required("Date/Time is required"),
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleUpdate = async () => {
    try {
      await schema.validate(
        { editedName, editedDescription, editedDateTime },
        { abortEarly: false },
      );
      onUpdate(todo._id, editedName, editedDescription, editedDateTime);
      setEditing(false);
    } catch (error) {
      const validationErrors: { [key: string]: string } = {};
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        setErrors(validationErrors);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditedName(todo.name);
    setEditedDescription(todo.description);
    setEditedDateTime(todo.dateTime);
    setEditing(false);
  };

  return (
    <div className="flex items-center justify-between border rounded-md p-3 mb-2">
      {editing ? (
        <>
          <div className="flex flex-col">
            <input
              type="text"
              className="border rounded-md p-2 mr-2 flex-grow"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
            {errors.editedName && (
              <span className="text-red-500">{errors.editedName}</span>
            )}
          </div>
          <div className="flex flex-col">
            <input
              type="text"
              className="border rounded-md p-2 mr-2 flex-grow"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
            {errors.editedDescription && (
              <span className="text-red-500">{errors.editedDescription}</span>
            )}
          </div>
          <div className="flex flex-col">
            <input
              type="datetime-local"
              className="border rounded-md p-2 mr-2"
              defaultValue={editedDateTime}
              onChange={(e) => setEditedDateTime(e.target.value)}
            />
            {errors.editedDateTime && (
              <span className="text-red-500">{errors.editedDateTime}</span>
            )}
          </div>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mr-2"
            onClick={handleUpdate}
          >
            Done
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <div className="mr-4">
            <h3 className="font-bold">{todo.name}</h3>
            <p>{todo.description}</p>
            <p>{new Date(todo.dateTime).toLocaleString()}</p>
          </div>
          <div>
            <button
              className={`${todo.done ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded-md  mr-2`}
              onClick={() => onComplete(todo._id)}
            >
              Complete
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2"
              onClick={() => onDelete(todo._id)}
            >
              Delete
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleEdit}
            >
              Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
