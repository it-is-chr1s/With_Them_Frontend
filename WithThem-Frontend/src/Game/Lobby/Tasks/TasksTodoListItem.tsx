import React from "react";

interface Props {
    task: string;
    state: string;
}

const TasksTodoListItem: React.FC<Props> = ({ task, state }) => {
    let color;
    if (state === "available"){
        color = "bg-red-500";
    }else if(state === "active"){
        color = "bg-orange-500"
    }

	return (
        <li className={color}>
            <span>{task}</span>
        </li>
	);
};

export default TasksTodoListItem;