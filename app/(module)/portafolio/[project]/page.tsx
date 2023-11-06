import Project from "@/components/project";

const ProjectPage = (props: any) => {
  return <Project id={props.params.project} />;
};

export default ProjectPage;
