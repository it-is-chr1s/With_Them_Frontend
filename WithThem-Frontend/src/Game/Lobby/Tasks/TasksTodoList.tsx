import React from "react";
import TasksTodoListItem from "./TasksTodoListItem";

interface Props {
  stateOfTasks: any;
}

const TaskTodoList: React.FC<Props> = ({ stateOfTasks }) => {
  return (
    <div className="p-4 bg-blue-500 rounded-md">
      <h1 className="text-xl font-bold text-center text-white">
        Task Todolist
      </h1>
      <ul>
        {stateOfTasks.map((task: any) => (
          <TasksTodoListItem task={task.task} state={task.state} />
        ))}
      </ul>
    </div>
  );
};

export default TaskTodoList;
