import React from "react";
import TasksTodoListItem from "./TasksTodoListItem";

interface Props {
    stateOfTasks: any;
}

const TaskTodoList: React.FC<Props> = ({ stateOfTasks }) => {
	return (
        <div>
            <h1>Tasks Todo-List</h1>
            <ul>
                {stateOfTasks.map((task: any) => (
                        <TasksTodoListItem task={task.task} state={task.state} />
                ))}
            </ul>
        </div>
	);
};

export default TaskTodoList;