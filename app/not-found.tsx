import React from "react";
import { RiErrorWarningFill } from "react-icons/ri";
const NotFound = () => {
  return (
    <div className="flex justify-center items-center space-x-2 pt-16">
      <RiErrorWarningFill />
      <p>Página No Encontrada</p>
    </div>
  );
};

export default NotFound;
