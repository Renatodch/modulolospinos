import ProjectList from "@/components/projectList";
import { loginIsRequiredServer } from "@/lib/login-controller";
import { getProjects } from "@/lib/project-controller";
import React from "react";

const Portafolio = async () => {
  await loginIsRequiredServer();
  const proojects = await getProjects();

  return <ProjectList />;
};

export default Portafolio;
