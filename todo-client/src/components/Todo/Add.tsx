import React, { useState } from "react";
import * as yup from "yup";

interface AddTodoProps {
  onAdd: (name: string, description: string, dateTime: string) => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState(
    new Date().toISOString().slice(0, 16),
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    dateTime: yup.string().required("Date/Time is required"),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    if (name === "name") {
      setName(value);
    } else if (name === "description") {
      setDescription(value);
    } else if (name === "dateTime") {
      setDateTime(value);
    }
  };

  const handleAdd = async () => {
    try {
      await schema.validate(
        { name, description, dateTime },
        { abortEarly: false },
      );
      onAdd(name, description, dateTime);
      setName("");
      setDescription("");
      setDateTime(new Date().toISOString());
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

  return (
    <div className="flex">
      <div className="mb-4 flex">
        <div className="flex flex-col mr-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border rounded-md p-2 mb-2 h-11"
            value={name}
            onChange={handleInputChange}
          />
          {errors.name && <span className="text-red-500">{errors.name}</span>}
        </div>
        <div className="flex flex-col mr-2">
          <input
            type="text"
            name="description"
            placeholder="Description"
            className="border rounded-md p-2 mb-2 h-11"
            value={description}
            onChange={handleInputChange}
          />
          {errors.description && (
            <span className="text-red-500">{errors.description}</span>
          )}
        </div>
        <div className="flex flex-col mr-2">
          <input
            type="datetime-local"
            name="dateTime"
            className="border rounded-md p-2 mb-2 h-11"
            value={dateTime}
            onChange={handleInputChange}
          />
          {errors.dateTime && (
            <span className="text-red-500">{errors.dateTime}</span>
          )}
        </div>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 h-11"
        onClick={handleAdd}
      >
        Add Todo
      </button>
    </div>
  );
};

export default AddTodo;
