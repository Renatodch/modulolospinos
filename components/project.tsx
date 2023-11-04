"use client";
import React from "react";

const Project = ({ id }: { id: string }) => {
  console.log(id);
  return (
    <div className="w-full px-16 py-8 flex justify-center h-screen">
      <p className="font-bold text-lg w-1/2 text-center h-1/2 flex justify-center items-center border-red-500 border-2">
        Aqui va el proyecto {id}
      </p>
    </div>
  );
};

export default Project;
