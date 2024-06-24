import React from "react";

interface Props {
  task: string;
  state: string;
}

const TasksTodoListItem: React.FC<Props> = ({ task, state }) => {
  let color;
  if (state === "available") {
    color = "bg-blue-500";
  } else if (state === "active") {
    color = "bg-blue-300";
  }

  return (
    <li className={color + " border-white border-2 rounded-md p-1 m-1"}>
      <span className="rounded-md text-white">
        <input type="checkbox" className="mr-2" value="" disabled></input>
        {task} {state}
      </span>
    </li>
  );
};

export default TasksTodoListItem;
