import Project from "@/components/project";
import React from "react";

interface Props {
  params: { project: string };
  searchParms: Object;
}

const ProjectPage = ({ params: { project } }: Props) => {
  return <Project id={project} />;
};

export default ProjectPage;
