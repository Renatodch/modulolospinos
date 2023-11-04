import Course from "@/components/course";
import { loginIsRequiredServer } from "@/lib/login-controller";
import React from "react";

const Courses = async () => {
  await loginIsRequiredServer();
  return <Course />;
};

export default Courses;
