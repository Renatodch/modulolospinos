import React from "react";
import { RiErrorWarningFill } from "react-icons/ri";
const NotAllowed = () => {
  return (
    <div className="flex justify-center items-center space-x-2 pt-16">
      <RiErrorWarningFill />
      <p>Acceso denegado</p>
    </div>
  );
};

export default NotAllowed;
