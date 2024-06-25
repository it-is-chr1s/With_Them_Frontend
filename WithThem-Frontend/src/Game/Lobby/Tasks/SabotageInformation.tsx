import React from "react";

interface Props {
  sabotageName: string;
  remainingTime: number;
}

const SabotageInformation: React.FC<Props> = ({ sabotageName, remainingTime }) => {
  return (
    <div className="p-4 bg-blue-500 rounded-md">
      <h1 className="text-xl font-bold text-center text-white">
        Sabotage Information
      </h1>
      <p className="text-white">
        {"Sabotage: "}
        <a className="font-bold">
          {sabotageName}
          </a>
      </p>
      <p className="text-white">
        {"Remaining Time: "}
        <a className="font-bold">
          {remainingTime + "s"}
          </a>
      </p>
    </div>
  );
};

export default SabotageInformation;
